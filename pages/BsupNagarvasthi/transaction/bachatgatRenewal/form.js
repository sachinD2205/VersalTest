import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  ThemeProvider,
  Select,
  TextField,
  RadioGroup,
  Radio,
  FormLabel,
  Tooltip,
  Checkbox,
  Typography,
  Modal,
  Slide,
} from "@mui/material";
import sweetAlert from "sweetalert";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import theme from "../../../../theme";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import bachatgatRegistration from "../../../../containers/schema/BsupNagarvasthiSchema/bachatgatRegistration";
import { yupResolver } from "@hookform/resolvers/yup";
import { manageStatus } from "../../../../components/rtiOnlineSystem/commonStatus/manageEnMr";
import { EncryptData,DecryptData } from "../../../../components/common/EncryptDecrypt";
import bsupUserRoles from "../../../../components/bsupNagarVasthi/userRolesBSUP";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";

const BachatGatCategory = () => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(bachatgatRegistration),
  });

  const [appliNo, setApplicationNo] = useState();
  const [currentStatus1, setCurrentStatus] = useState();
  const [statusAll, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user.user);
  const router = useRouter();
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );
  const [statusVal, setStatusVal] = useState(null);
  const [remarkTableData, setRemarkData] = useState([]);
  const [memberList, setMemberData] = useState([]);
  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roleIds;
  const language = useSelector((state) => state.labels.language);
  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [crAreaNames, setCRAreaName] = useState([]);
  const [bankMaster, setBankMasters] = useState([]);
  const [bachatGatCategory, setBachatGatCategory] = useState([]);
  const [redId, setRegId] = useState(null);
  const [registrationDetails, setRegistrationDetails] = useState([]);
  const [fetchDocument, setFetchDocuments] = useState([]);
  const [userLst, setUserLst] = useState([]);
  const [existingBachatGat, setExistingBachatGat] = useState(false);
  const loggedUser = localStorage.getItem("loggedInUser");
  // Enable Disable approve reject revert button
  const [samuhaSanghatakRemark, setSamuhaSanghatakRemark] = useState("");
  const [deptClerkRemark, setDeptClerkRemark] = useState("");
  const [asstCommissionerRemark, setAsstCommissionerRemark] = useState("");
  const [deptyCommissionerRemark, setDeptyCommissionerRemark] = useState("");
  const [isRemarksFilled, setIsRemarksFilled] = useState(false);
  const [isApproveChecked, setIsApproveChecked] = useState(false);
  const [isRevertChecked, setIsRevertChecked] = useState(false);
  const [isRejectChecked, setIsRejectChecked] = useState(false);
  const [bachatgatrejectionCategories, setBachatgatrejectionCategories] =
    useState([]);
  const [hanadleStudent, setHanadleStudent] = useState([]);
  const [serviceId, setServiceId] = useState([]);
  const [rejectReason, setRejectReason] = useState();
  const [renewalRemarks, setRenewalRemark] = useState("");
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

  const [bachatgatApprovalCategories, setBachatgatApprovalCategories] =
    useState([]);
  const [bachatgatRevertCategories, setBachatgatRevertCategories] = useState(
    []
  );

  const [value1, setValue1] = useState("false");
  const [value2, setValue2] = useState("false");
  const [value3, setValue3] = useState("false");

  const handleQuestionAnswerChange = (event) => {
    // setValue1(event.target.value);
  };

  useEffect(() => {
    setValue1(watch("questionFirstOption"));
  }, [watch("questionFirstOption")]);
  useEffect(() => {
    setValue2(watch("questionSecoundOption"));
  }, [watch("questionSecoundOption")]);
  useEffect(() => {
    setValue3(watch("questionThirdOption"));
  }, [watch("questionThirdOption")]);

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
    setIsRemarksFilled(
      samuhaSanghatakRemark ||
        deptClerkRemark ||
        asstCommissionerRemark ||
        deptyCommissionerRemark
    );
  }, [
    samuhaSanghatakRemark,
    deptClerkRemark,
    asstCommissionerRemark,
    deptyCommissionerRemark,
  ]);

  // Function to handle checkbox changes
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    // Update checkbox state
    setIsApproveChecked(name === "approve" && checked);
    setIsRevertChecked(name === "revert" && checked);
    setIsRejectChecked(name === "reject" && checked);
  };

  useEffect(() => {
    setIsRemarksFilled(renewalRemarks);
  }, [renewalRemarks]);

  // const handleRemarkChange = (event) => {
  //   const fieldName = event.target.name;
  //   const fieldValue = event.target.value;

  //   switch (fieldName) {
  //     case "saSanghatakRemark":
  //       setSamuhaSanghatakRemark(fieldValue);
  //       break;
  //     case "deptClerkRemark":
  //       setDeptClerkRemark(fieldValue);
  //       break;
  //     case "asstCommissionerRemark":
  //       setAsstCommissionerRemark(fieldValue);
  //       break;
  //     case "deptyCommissionerRemark":
  //       setDeptyCommissionerRemark(fieldValue);
  //       break;
  //     default:
  //       break;
  //   }
  // };

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

  const backButton = () => {
    if (loggedUser === "citizenUser") {
      router.push({
        pathname: "/dashboard",
      });
    } else {
      router.push({
        pathname: "/BsupNagarvasthi/transaction/bachatgatRenewal",
      });
    }
  };

  // fetch bachatgat regsitration details by id
  useEffect(() => {
    getUser();
    if (router.query.id != null && router.query.id != undefined) {
      fetchRegistrationDetails();
    }
  }, [router.query.id && bankMaster]);

  useEffect(() => {
    getZoneName();
    getWardNames();
    getCRAreaName();
    getAllStatus();
    getBachatGatCategory();
    getBank();
    getUser();
    getRejectCategories();
  }, []);

  useEffect(() => {
    if (isRejectChecked) {
      setRejectReason(hanadleStudent.toString());
    }
  }, [hanadleStudent]);

  useEffect(() => {
    if (isRejectChecked) {
      setRejectReason(hanadleStudent.toString());
    }
  }, [hanadleStudent]);

  // const handleChange = (event, studentId) => {
  //   if (studentId === "all") {
  //     if (event.target.checked) {
  //       setServiceId(bachatgatrejectionCategories.map((student) => student.id));
  //       setHanadleStudent(
  //         bachatgatrejectionCategories.map((student) => student.rejectCat)
  //       );
  //     } else {
  //       setServiceId([]);
  //       setHanadleStudent([]);
  //     }
  //   } else {
  //     if (event.target.checked) {
  //       let dummy = bachatgatrejectionCategories.find(
  //         (obj) => obj.id === studentId
  //       )?.rejectCat;
  //       setServiceId([...serviceId, studentId]);
  //       setHanadleStudent([...hanadleStudent, dummy]);
  //     } else {
  //       setServiceId(serviceId?.filter((obj) => obj !== studentId));
  //       setHanadleStudent(hanadleStudent?.filter((obj) => obj !== studentId));
  //     }
  //   }
  // };

  // load bachat gat reject categories
  const getRejectCategories = () => {
    axios
      .get(
        `${urls.BSUPURL}/mstRejectCategory/getAllBachatGatRejectionCategories`,
        {
          headers: headers,
        }
      )
      .then((r) => {

        setBachatgatApprovalCategories(
          r.data.mstRejectCategoryDao.map((row) => ({
            id: row.id,
            rejectCat: row.rejectCat,
            rejectCatMr: row.rejectCatMr,
            forBachatGatorScheme: row.forBachatGatorScheme,
            categoryType: row.categoryType,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
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

  // call api by id
  const fetchRegistrationDetails = () => {
    setIsLoading(true);
    axios
      .get(
        `${urls.BSUPURL}/trnBachatgatRegistration/getById?id=${router.query.id}`,
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

  useEffect(() => {
    if (registrationDetails != null) {
      setDataOnForm();
    }
  }, [registrationDetails, language]);

  const setDataOnForm = () => {
    let data = registrationDetails;
    setRegId(data.bgRegistrationKey);
    setExistingBachatGat(data.existingBachatgat);
    setApplicationNo(data.applicationNo);
    setValue("areaKey", data.areaKey);
    setValue("zoneKey", data.zoneKey);
    setValue("wardKey", data.wardKey);
    setValue("geoCode", data.geoCode);
    setValue("savingAccountNo", data.accountNo);
    setValue("bachatgatName", data.bachatgatName);
    setValue("bachatgatNo", data.bachatgatNo);
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
    setStatusVal(data?.status);
    setValue("rejectReason", data?.rejectReason);
    setValue(
      "bankNameId",
      language === "en"
        ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.bankName
          ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.bankName
          : "-"
        : bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.bankNameMr
        ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.bankNameMr
        : "-"
    );
    setValue("bankAccountFullName", data.bankAccountFullName);

    setValue(
      "bankBranchKey",
      language === "en"
        ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.bankName
          ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.bankName
          : "-"
        : bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.bankNameMr
        ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.bankNameMr
        : "-"
    );
    setValue("micrCode", data.micrCode);
    setValue("pan_no", data.pan_no);

    setValue("branchName", data.branchName);
    setValue("ifscCode", data.ifscCode);
    setValue("startDate", data.startDate);
    setValue("saSanghatakRemark", data.saSanghatakRemark);
    setValue("deptClerkRemark", data.deptClerkRemark);
    setValue("deptyCommissionerRemark", data.deptyCommissionerRemark);
    setValue("asstCommissionerRemark", data.asstCommissionerRemark);
    setValue3(data.questionThirdOption === "true" ? "true" : "false");
    setValue2(data.questionSecoundOption === "true" ? "true" : "false");
    setValue1(data.questionFirstOption === "true" ? "true" : "false");

    setValue(
      "questionThirdOption",
      data.questionThirdOption === "true" ? "true" : "false"
    );
    setValue(
      "questionSecoundOption",
      data.questionSecoundOption === "true" ? "true" : "false"
    );
    setValue("questionThirdAns", data.questionThirdAns);
    setValue("questionSecoundAns", data.questionSecoundAns);
    setValue("questionFirstAns", data.questionFirstAns);
    setValue(
      "questionFirstOption",
      data.questionFirstOption === "true" ? "true" : "false"
    );
    setValue("renewalRemarks", data.renewalRemarks);
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

    const bankDoc = [];
    let _res = data.trnBachatgatRegistrationDocumentsList?.map((r, i) => {
      bankDoc.push({
        id: i + 1,
        title: language == "en" ? "Other" : "इतर",
        filenm: language == "en" ? "Other" : "इतर",
        documentType: r.documentType,
        documentPath: r.documentPath,
      });
    });

    if (data.passbookFrontPage && data.passbookLastPage) {
      bankDoc.push({
        id: data.trnBachatgatRegistrationDocumentsList.length + 1,
        title: language == "en" ? "Passbook Front Page" : "पासबुकचे पहिले पान",
        documentType: "r.documentType",
        documentPath: data.passbookFrontPage,
        filenm: language == "en" ? "Passbook Front Page" : "पासबुकचे पहिले पान",
      });
      bankDoc.push({
        id: data.trnBachatgatRegistrationDocumentsList.length + 2,
        title: language == "en" ? "Passbook Back Page" : "पासबुकचे मागील पान",
        documentType: "r.documentType",
        documentPath: data.passbookLastPage,
        filenm: language == "en" ? "Passbook Back Page" : "पासबुकचे मागील पान",
      });
    } else if (data.passbookLastPage) {
      bankDoc.push({
        id: data.trnBachatgatRegistrationDocumentsList.length + 3,
        title: language == "en" ? "Passbook Back Page" : "पासबुकचे मागील पान",
        documentType: "r.documentType",
        documentPath: data.passbookLastPage,
        filenm: language == "en" ? "Passbook Back Page" : "पासबुकचे मागील पान",
      });
    } else if (data.passbookFrontPage) {
      bankDoc.push({
        id: data.trnBachatgatRegistrationDocumentsList?.length + 4,
        title: language == "en" ? "Passbook Front Page" : "पासबुकचे पहिले पान",
        documentPath: data.passbookFrontPage,
        filenm:
          data.passbookFrontPage &&
          data.passbookFrontPage.split("/").pop().split("_").pop(),
      });
    }
    bankDoc && setFetchDocuments([...bankDoc]);
    setCurrentStatus(manageStatus(data.status, language, statusAll));
  };

  // table header
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
    },
    {
      field: "Action",
      headerName: <FormattedLabel id="actions" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
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
                // window.open(
                //   `${urls.CFCURL}/file/preview?filePath=${record.row.documentPath}`,
                //   "_blank"
                // );
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

  // save cancellation
  const onSubmitForm = (formData) => {
    setIsLoading(true);
    let body = [
      {
        ...registrationDetails,
        renewalRemarks: watch("renewalRemarks"),
        saSanghatakRemark: null,
        deptClerkRemark: null,
        asstCommissionerRemark: null,
        deptyCommissionerRemark: null,
        isBenifitedPreviously: false,
        status: 7,
        isComplete: true,
        isDraft: false,
        id: null,
        bgRegistrationKey: Number(router.query.id),
      },
    ];

    const tempData = axios
      .post(`${urls.BSUPURL}/trnBachatgatRenewal/save`, body, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          sweetAlert({
            title: language === "en" ? "Saved!" : "जतन केले",
            text:
              language === "en"
                ? `Application no ${
                    res.data.message.split("[")[1].split("]")[0]
                  } renewed successfully !`
                : `अर्ज क्रमांक ${
                    res.data.message.split("[")[1].split("]")[0]
                  } यशस्वीरित्या नूतनीकरण केले!`,

            icon: "success",
            showCancelButton: false,
            confirmButtonText: language === "en" ? "Ok" : "ठीक आहे",
            allowOutsideClick: false, // Prevent closing on outside click
            allowEscapeKey: false, // Prevent closing on Esc key
            closeOnClickOutside: false, // Prevent closing on click outside
          }).then((will) => {
            // if (result.isConfirmed) {
            if (will) {
              router.push("/BsupNagarvasthi/transaction/bachatgatRenewal");
            }
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
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={6}
              xl={6}
              style={{
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
              md={12}
              lg={6}
              xl={6}
              style={{
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
                            {language == "en"
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
                            {language == "en"
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
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                    >
                      {wardNames &&
                        wardNames.map((service, index) => (
                          <MenuItem key={index} value={service.id}>
                            {language == "en"
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
                error={!!errors.geoCode}
                helperText={errors?.geoCode ? errors.geoCode.message : null}
              />
            </Grid>

            {/* Bachat Gat No */}
            {watch("bachatgatNo") !== "" && (
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TextField
                  // sx={{ width: "90%" }}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  disabled={true}
                  label={<FormattedLabel id="bachatgatNo" />}
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                  {...register("bachatgatNo")}
                  // value={
                  //   watch("bachatgatNo")
                  // }

                  error={!!errors.bachatgatNo}
                  helperText={
                    errors?.bachatgatNo ? errors.bachatgatNo.message : null
                  }
                />
              </Grid>
            )}

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
                            {language == "en"
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
                        disabled
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
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
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
                error={!!errors.landlineNo}
                helperText={
                  errors?.landlineNo ? errors.landlineNo.message : null
                }
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
                {...register("bankBranchKey")}
                error={!!errors.bankBranchKey}
                helperText={
                  errors?.bankBranchKey ? errors.bankBranchKey.message : null
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
                {...register("micrCode")}
                disabled={true}
                InputLabelProps={{ shrink: true }}
                error={!!errors.micrCode}
                helperText={errors?.micrCode ? errors.micrCode.message : null}
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
                disabled={true}
                {...register("pan_no")}
                InputLabelProps={{
                  shrink: watch("pan_no") ? true : false,
                }}
                error={!!errors.pan_no}
                helperText={errors?.pan_no ? errors.pan_no.message : null}
              />
            </Grid>
            {existingBachatGat === false && (
              <>
                <Grid container>
                  <FormControl
                    style={{
                      flexDirection: "row",
                      alignItems: "baseline",
                      gap: "29px",
                    }}
                  >
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      {<FormattedLabel id="question1" />}
                    </FormLabel>
                    <RadioGroup
                      style={{ marginTop: 5 }}
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      row
                      name="questionFirstOption"
                      control={control}
                      value={value1}
                      // onChange={handleQuestionAnswerChange}
                      {...register("questionFirstOption")}
                    >
                      <FormControlLabel
                        value={"true"}
                        disabled
                        control={<Radio />}
                        label={<FormattedLabel id="yes" />}
                        name="RadioButton"
                        {...register("questionFirstOption")}
                        error={!!errors.questionFirstOption}
                        helperText={
                          errors?.questionFirstOption
                            ? errors.questionFirstOption.message
                            : null
                        }
                      />
                      <FormControlLabel
                        value={"false"}
                        disabled
                        control={<Radio />}
                        label={<FormattedLabel id="no" />}
                        name="RadioButton"
                        {...register("questionFirstOption")}
                        error={!!errors.questionFirstOption}
                        helperText={
                          errors?.questionFirstOption
                            ? errors.questionFirstOption.message
                            : null
                        }
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                {value1 === "true" && (
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="mahilaPrashikshan" />}
                      variant="standard"
                      inputProps={{ maxLength: 5000 }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      multiline
                      {...register("questionFirstAns")}
                      error={!!errors.questionFirstAns}
                      helperText={
                        errors?.questionFirstAns
                          ? errors.questionFirstAns.message
                          : null
                      }
                    />
                  </Grid>
                )}

                <Grid container>
                  <FormControl
                    style={{
                      flexDirection: "row",
                      alignItems: "baseline",
                      gap: "29px",
                    }}
                  >
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      {<FormattedLabel id="question2" />}
                    </FormLabel>
                    <RadioGroup
                      style={{ marginTop: 5 }}
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      row
                      name="questionSecoundOption"
                      control={control}
                      value={value2}
                      // onChange={handleQuestionAnswerChange}
                      {...register("questionSecoundOption")}
                    >
                      <FormControlLabel
                        value={"true"}
                        control={<Radio />}
                        disabled
                        label={<FormattedLabel id="yes" />}
                        name="RadioButton"
                        {...register("questionSecoundOption")}
                        error={!!errors.questionSecoundOption}
                        helperText={
                          errors?.questionSecoundOption
                            ? errors.questionSecoundOption.message
                            : null
                        }
                      />
                      <FormControlLabel
                        value={"false"}
                        control={<Radio />}
                        disabled
                        label={<FormattedLabel id="no" />}
                        name="RadioButton"
                        {...register("questionSecoundOption")}
                        error={!!errors.questionSecoundOption}
                        helperText={
                          errors?.questionSecoundOption
                            ? errors.questionSecoundOption.message
                            : null
                        }
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                {value2 === "true" && (
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="vyavsayacheNav" />}
                      variant="standard"
                      inputProps={{ maxLength: 5000 }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      multiline
                      {...register("questionSecoundAns")}
                      error={!!errors.questionSecoundAns}
                      helperText={
                        errors?.questionSecoundAns
                          ? errors.questionSecoundAns.message
                          : null
                      }
                    />
                  </Grid>
                )}

                <Grid container>
                  <FormControl
                    style={{
                      flexDirection: "row",
                      alignItems: "baseline",
                      gap: "29px",
                    }}
                  >
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      {<FormattedLabel id="question3" />}
                    </FormLabel>
                    <RadioGroup
                      style={{ marginTop: 5 }}
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      row
                      name="questionThirdOption"
                      control={control}
                      value={value3}
                      // onChange={handleQuestionAnswerChange}
                      {...register("questionThirdOption")}
                    >
                      <FormControlLabel
                        value={"true"}
                        control={<Radio />}
                        disabled
                        label={<FormattedLabel id="yes" />}
                        name="RadioButton"
                        {...register("questionThirdOption")}
                        error={!!errors.questionThirdOption}
                        helperText={
                          errors?.questionThirdOption
                            ? errors.questionThirdOption.message
                            : null
                        }
                      />
                      <FormControlLabel
                        value={"false"}
                        control={<Radio />}
                        disabled
                        label={<FormattedLabel id="no" />}
                        name="RadioButton"
                        {...register("questionThirdOption")}
                        error={!!errors.questionThirdOption}
                        helperText={
                          errors?.questionThirdOption
                            ? errors.questionThirdOption.message
                            : null
                        }
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                {value3 === "true" && (
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="vVyasaycheNav" />}
                      variant="standard"
                      inputProps={{ maxLength: 5000 }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      multiline
                      {...register("questionThirdAns")}
                      error={!!errors.questionThirdAns}
                      helperText={
                        errors?.questionThirdAns
                          ? errors.questionThirdAns.message
                          : null
                      }
                    />
                  </Grid>
                )}
              </>
            )}
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
                      <FormattedLabel id="uploadedDoc" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* document columns */}
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
              rows={fetchDocument}
              columns={docColumns}
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

          <Grid container spacing={2} sx={{ padding: "1rem" }}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              {/* <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="renewalRemark" />}
                  variant="standard"
                  multiline
                  {...register("renewalRemarks")}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.renewalRemarks}
                  helperText={
                    errors?.renewalRemarks ? errors.renewalRemarks.message : null
                  }
                /> */}
              <TextField
                required
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="renewalRemark" />}
                variant="standard"
                {...register("renewalRemarks")}
                value={renewalRemarks}
                multiline
                inputProps={{ maxLength: 1000 }}
                onChange={(e) => handleRemarkChange(e, "renewalRemarks")}
                InputLabelProps={{ shrink: true }}
                error={!!errors.renewalRemarks}
                helperText={
                  errors?.renewalRemarks ? errors.renewalRemarks.message : null
                }
              />
            </Grid>
          </Grid>
          <Grid container spacing={4} sx={{ padding: "1rem" }}>
            {(loggedUser === "citizenUser" ||
              (statusVal != 2 &&
                statusVal != 23 &&
                authority &&
                authority.find(
                  (val) => val === bsupUserRoles.roleSamuhaSanghatak
                )) ||
              (statusVal != 5 &&
                statusVal != 6 &&
                authority &&
                authority.find(
                  (val) => val === bsupUserRoles.roleZonalOfficer
                )) ||
              (statusVal != 3 &&
                statusVal != 4 &&
                authority &&
                authority.find(
                  (val) => val === bsupUserRoles.roleZonalClerk
                )) ||
              (statusVal != 7 &&
                authority &&
                authority.find(
                  (val) => val === bsupUserRoles.roleHOClerk
                ))) && (
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={6}
                xl={6}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  sx={{ margin: 1 }}
                  variant="contained"
                  color="error"
                  // className={commonStyles.buttonBack}
                  size="small"
                  onClick={() => backButton()}
                >
                  <FormattedLabel id="back" />
                </Button>
              </Grid>
            )}
            {(loggedUser === "citizenUser" ||
              (statusVal != 2 &&
                statusVal != 23 &&
                authority &&
                authority.find(
                  (val) => val === bsupUserRoles.roleSamuhaSanghatak
                )) ||
              (statusVal != 5 &&
                statusVal != 6 &&
                authority &&
                authority.find(
                  (val) => val === bsupUserRoles.roleZonalOfficer
                )) ||
              (statusVal != 3 &&
                statusVal != 4 &&
                authority &&
                authority.find(
                  (val) => val === bsupUserRoles.roleZonalClerk
                )) ||
              (statusVal != 7 &&
                authority &&
                authority.find(
                  (val) => val === bsupUserRoles.roleHOClerk
                ))) && (
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={6}
                xl={6}
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
                  disabled={!isRemarksFilled}
                  onClick={onSubmitForm}
                  endIcon={<SaveIcon />}
                >
                  <FormattedLabel id="renew" />
                </Button>
              </Grid>
            )}
          </Grid>
        </form>
      </Paper>
    </ThemeProvider>
  );
};

export default BachatGatCategory;
