import React, { useEffect, useState } from "react";
import router from "next/router";
import ClearIcon from "@mui/icons-material/Clear";
import theme from "../../../../../theme";
import SaveIcon from "@mui/icons-material/Save";
import {
  Paper,
  Button,
  RadioGroup,
  TextField,
  Radio,
  ThemeProvider,
  Box,
  FormControl,
  FormControlLabel,
  Grid,
  Modal,
  IconButton,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Controller, useForm } from "react-hook-form";
import { DataGrid } from "@mui/x-data-grid";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import moment from "moment";
import { useSelector } from "react-redux";
import axios from "axios";
import urls from "../../../../../URLS/urls";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { manageStatus } from "../../../../../components/rtiOnlineSystem/commonStatus/manageEnMr";
import { ExitToApp, Save } from "@mui/icons-material";
import FileTable from "../../../../../components/SlumBillingManagementSystem/FileUpload/FileTable";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import commonRoleId from "../../../../../components/SlumBillingManagementSystem/FileUpload/RoleId/commonRole";
import { ToWords } from "to-words";
import BreadcrumbComponent from "../../../../../components/common/BreadcrumbComponent";
import commonStyles from "../../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";
import {
  EncryptData,
  DecryptData,
} from "../../../../../components/common/EncryptDecrypt";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../../util/commonErrorUtil";
const schemaForSiteVisitDoneTrue = yup.object().shape({
  // Define your schema here for siteVisitDone === false
  // Example:
  // someOtherField: yup.string().required('This field is required'),
});

const schemaForSiteVisitDoneFalse = yup.object().shape({
  visitTime: yup
    .string()
    .required(<FormattedLabel id="visitTimeValidation" />)
    .nullable(),
  slattitude: yup
    .string()
    .required(<FormattedLabel id="lattitudeValidation" />)
    .nullable(),
  slongitude: yup
    .string()
    .required(<FormattedLabel id="longitudeValidation" />)
    .nullable(),
  sgeocode: yup
    .string()
    .required(<FormattedLabel id="geocodeValidation" />)
    .nullable(),
});

const Index = () => {
  const [validationSchema, setValidationSchema] = useState(
    schemaForSiteVisitDoneTrue
  );
  const {
    register,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(validationSchema),
    //   isRescheduled1 || isScheduled1  === "true"
    //     ? yupResolver(schemaForSiteVisitDoneTrue)
    //     : yupResolver(schemaForSiteVisitDoneFalse),
    mode: "onChange",
  });
  const [familyMembers, setFamilyMembers] = useState([]);
  const [relationDetails, setRelationDetails] = useState([
    {
      id: 1,
      relation: "",
      relationMr: "",
    },
  ]);
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
  const [docList, setDocList] = useState([]);
  const [titleData, setTitleData] = useState([]);
  const [villageData, setVillageData] = useState([]);

  const handleCompleteSiteVisit = (isCompleteRescheduled) => {
    if (!isCompleteRescheduled) {
      setValidationSchema(schemaForSiteVisitDoneFalse);
    } else {
      setValidationSchema(schemaForSiteVisitDoneTrue);
    }
  };

  const language = useSelector((state) => state.labels.language);
  const user = useSelector((state) => state.user.user);
  let loggedInUser = localStorage.getItem("loggedInUser");
  const [isLoading, setIsLoading] = useState(false);
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );
  const [authorizedToUpload, setAuthorizedToUpload] = useState(true);
  const [attachedFile, setAttachedFile] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [mainFiles, setMainFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [finalFiles, setFinalFiles] = useState([]);
  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roleIds;
  const [statusAll, setStatus] = useState([]);
  const [statusVal, setStatusVal] = useState(null);
  const [photo, setPhoto] = useState("");
  const [currentStatus1, setCurrentStatus] = useState();
  const [appliNo, setApplicationNo] = useState();
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [isOverduePayment, setIsOverduePayment] = useState(false);
  const [dataSource, setDataSource] = useState(null);
  const [hutData, setHutData] = useState(null);
  const [scheduleList, setScheduleList] = useState([]);
  const [manageSiteVisitList, setManageSiteVisitList] = useState([]);
  const [payloadImages, setPayloadImages] = useState({});
  const [completeSiteVisitDoc, setCompleteSiteVisitDoc] = useState([]);
  const [isRemarksFilled, setIsRemarksFilled] = useState(false);
  const [isModalOpenForResolved, setIsModalOpenForResolved] = useState(false);
  const [clerkApprovalRemark, setClerkRemark] = useState("");
  const [headClerkApprovalRemark, setHeadClerkRemark] = useState("");
  const [completeApprovalRemark, setCompleteApprovalRemark] = useState("");
  const [officeSuperintendantApprovalRemark, setOfficeSuperInRemark] =
    useState("");
  const [finalApprovedRemark, setFinalRemark] = useState("");
  const [administrativeOfficerApprovalRemark, setAdministrativeOfficerRemark] =
    useState("");
  const [assistantCommissionerApprovalRemark, setAssistantCommissionerRemark] =
    useState("");
  const [totalInWords, setTotalInWords] = useState(0);
  const [areaData, setAreaData] = useState([]);
  const [slumData, setSlumData] = useState([]);
  const [zoneDetails, setZoneDetails] = useState([]);
  const toWordsEn = new ToWords({ localeCode: "en-IN" });
  const toWordsMr = new ToWords({ localeCode: "mr-IN" });
  const toWords = language == "en" ? toWordsEn : toWordsMr;
  const [documentList, setDocumentList] = useState([]);
  const headers = { Authorization: `Bearer ${user?.token}` };

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

  // Loi amount convert to amount in word
  const handleTotalAmountChange = (event) => {
    const totalAmountValue = event.target.value;
    const totalAmountNumber = parseFloat(totalAmountValue);
    const amountToConvert = isNaN(totalAmountNumber) ? 0 : totalAmountNumber;
    const words = toWords.convert(amountToConvert);
    setTotalInWords(words);
  };

  // Family Member columns
  const memberColumns = [
    {
      headerClassName: "cellColor",
      field: "id",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
    },
    {
      headerClassName: "cellColor",
      field: language == "en" ? "fullName" : "fullNameMr",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="fullName" />,
      flex: 1,
    },
    {
      headerClassName: "cellColor",
      field: "age",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="age" />,
      flex: 1,
    },
    {
      headerClassName: "cellColor",
      headerAlign: "center",
      align: "center",
      field:
        language == "en"
          ? "relationWithHeadOfFamily"
          : "relationWithHeadOfFamilyMr",
      headerName: <FormattedLabel id="relation" />,
      flex: 1,
    },
  ];



  // attach document
  const attachFileColumns = [
    {
      headerClassName: "cellColor",
      field: "srNo",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
    },
    {
      headerClassName: "cellColor",
      field: language == "en" ? "fileName" : "fileNameMr",
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="fileName" />,
      flex: 1,
    },
    {
      field: "attachedDoc1",
      headerName: <FormattedLabel id="attachment" />,
      width: 240,
      renderCell: (params) => {
        return (
          <Box>
            {params?.row?.documentPath ? (
              <>
                <IconButton
                  color="primary"
                  onClick={() => {
                    getFilePreview(params?.row?.documentPath);
                  }}
                >
                  <VisibilityIcon />
                </IconButton>
              </>
            ) : (
              <FormattedLabel id="noDocUpload" />
            )}
          </Box>
        );
      },
    },
  ];
  useEffect(() => {
    getTransferTypeDocType();
  }, []);

  const getTransferTypeDocType = () => {
    setIsLoading(true);
    axios
      .get(
        `${urls.CFCURL}/master/documentMaster/getDocumentByService?serviceId=123`,
        {
          headers: headers,
        }
      )
      .then((r) => {
        setIsLoading(false);
        setDocumentList(r.data.documentMaster);
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, true);
      });
  };

  // Document columns
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

  // file attache column
  const _columns = [
    {
      headerName: `${language == "en" ? "Sr.No" : "अं.क्र"}`,
      field: "srNo",
      headerAlign: "center",
      align: "center",
      flex: 0.2,
    },
    {
      headerName: `${language == "en" ? "File Name" : "दस्ताऐवजाचे नाव"}`,
      field: "fileName",
      headerAlign: "center",
      align: "center",
      width: 300,
    },
    {
      headerName: `${language == "en" ? "File Type" : "दस्ताऐवजाचे स्वरूप"}`,
      field: "extension",
      headerAlign: "center",
      align: "center",
      width: 150,
    },
    language == "en"
      ? {
          headerName: "Uploaded By",
          field: "attachedNameEn",
          headerAlign: "center",
          align: "center",
          flex: 1,
        }
      : {
          headerName: "द्वारे अपलोड केले",
          field: "attachedNameMr",
          headerAlign: "center",
          align: "center",
          flex: 1,
        },
    {
      headerName: `${language == "en" ? "Action" : "क्रिया"}`,
      field: "Action",
      headerAlign: "center",
      align: "center",
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

  // schedule table columns
  const columns = [
    {
      field: "id",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "scheduledTimeText",
      headerName: <FormattedLabel id="scheduleDateTime" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
    },
  ];

  const handleCancel = () => {
    setIsModalOpenForResolved(false);
  };

  // For Documents
  useEffect(() => {
    setFinalFiles([...mainFiles, ...additionalFiles]);
  }, [mainFiles, additionalFiles]);

  useEffect(() => {
    finalFiles &&
      finalFiles.map((each, i) => {
        if (i < 5) {
          setPayloadImages({
            ...payloadImages,
            [`siteImage${i + 1}`]: each?.filePath,
          });
        }
      });
  }, [finalFiles]);
  // //////

  // Set Department remarks
  useEffect(() => {
    setIsRemarksFilled(
      completeApprovalRemark ||
        clerkApprovalRemark ||
        headClerkApprovalRemark ||
        officeSuperintendantApprovalRemark ||
        administrativeOfficerApprovalRemark ||
        assistantCommissionerApprovalRemark ||
        finalApprovedRemark
    );
  }, [
    completeApprovalRemark,
    clerkApprovalRemark,
    headClerkApprovalRemark,
    officeSuperintendantApprovalRemark,
    administrativeOfficerApprovalRemark,
    assistantCommissionerApprovalRemark,
    finalApprovedRemark,
  ]);
  //

  // Handle remark
  const handleRemarkChange = (event) => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    switch (fieldName) {
      case "clerkApprovalRemark":
        setClerkRemark(fieldValue);
        break;
      case "headClerkApprovalRemark":
        setHeadClerkRemark(fieldValue);
        break;
      case "officeSuperintendantApprovalRemark":
        setOfficeSuperInRemark(fieldValue);
        break;
      case "administrativeOfficerApprovalRemark":
        setAdministrativeOfficerRemark(fieldValue);
        break;
      case "assistantCommissionerApprovalRemark":
        setAssistantCommissionerRemark(fieldValue);
        break;
      case "finalApprovedRemark":
        setFinalRemark(fieldValue);
        break;
      case "remarks":
        setCompleteApprovalRemark(fieldValue);
        break;
      default:
        break;
    }
  };

  // Check clerk role
  const checkAuth = () => {
    return authority.includes(commonRoleId.ROLE_CLERK) ? false : true;
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
          temp?.serviceChargeTypeName === null
            ? "-"
            : temp?.serviceChargeTypeName
        );
        setTotalInWords(toWords.convert(temp?.amount));
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // Check some condition for hide and show
  const checkSomeCondition = () => {
    return (
      (statusVal == 26 &&
        authority &&
        authority.find((val) => val === commonRoleId.ROLE_CLERK)) ||
      (statusVal == 5 &&
        authority &&
        authority.find((val) => val === commonRoleId.ROLE_HEAD_CLERK)) ||
      (statusVal == 7 &&
        authority &&
        authority.find(
          (val) => val === commonRoleId.ROLE_OFFICE_SUPERINTENDANT
        )) ||
      (authority &&
        authority.find(
          (val) => val === commonRoleId.ROLE_ADMINISTRATIVE_OFFICER
        ) &&
        statusVal == 9) ||
      (authority &&
        authority.find(
          (val) =>
            val === commonRoleId.ROLE_ASSISTANT_COMMISHIONER && statusVal == 11
        ))
    );
  };

  // get hut details by router id
  useEffect(() => {
    if (router.query.id != undefined && router.query.id != null) {
      getHutTransferById(router.query.id);
    }
  }, [router.query.id]);

  // Initial rest calls
  useEffect(() => {
    getServiceCharges();
    getAllStatus();
    getTitleData();
    getRelationDetails();
    getVillageData();
    getAreaData();
    getSlumData();
    getZoneData();
  }, []);

  // get all staus through api
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
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get hut transfer by router id
  const getHutTransferById = () => {
    setIsLoading(true);
    axios
      .get(`${urls.SLUMURL}/trnTransferHut/getById?id=${router.query.id}`, {
        headers: headers,
      })
      .then((r) => {
        setIsLoading(false);
        let result = r.data;
        setDataSource(result);
        getHutData(result?.hutKey);
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  // get relation details
  const getRelationDetails = () => {
    axios
      .get(`${urls.SLUMURL}/mstRelation/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let temp = r.data.mstRelationDao;
        setRelationDetails(
          temp?.map((row) => ({
            id: row.id,
            relation: row.relation,
            relationMr: row.relationMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getIcardPhoto = (filePath) => {
    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);
    const url = ` ${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: headers,
      })
      .then((r) => {
        setPhoto(r?.data?.fileName);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // set data on page
  useEffect(() => {
    if (dataSource != null) {
      let res = dataSource;
      setValue(
        "currentOwnerFirstName",
        !res?.currentOwnerFirstName
          ? "-"
          : language == "en"
          ? res?.currentOwnerFirstName
          : res?.currentOwnerFirstNameMr
      );
      setValue(
        "currentOwnerMiddleName",
        !res?.currentOwnerMiddleName
          ? "-"
          : language == "en"
          ? res?.currentOwnerMiddleName
          : res?.currentOwnerMiddleNameMr
      );
      setValue(
        "currentOwnerLastName",
        !res?.currentOwnerLastName
          ? "-"
          : language == "en"
          ? res?.currentOwnerLastName
          : res?.currentOwnerLastNameMr
      );
      setValue(
        "currentOwnerMobileNo",
        res?.currentOwnerMobileNo ? res?.currentOwnerMobileNo : "-"
      );
      setValue(
        "currentOwnerEmailId",
        res?.currentOwnerEmailId ? res?.currentOwnerEmailId : "-"
      );
      setStatusVal(res.status);
      setValue(
        "currentOwnerAadharNo",
        res?.currentOwnerAadharNo ? res?.currentOwnerAadharNo : "-"
      );
      setManageSiteVisitList(res?.trnVisitScheduleList);
      setValue(
        "scheduledTime",
        res?.trnVisitScheduleList[0]?.scheduledTimeText
      );
      setScheduleList(
        res?.trnVisitScheduleList.map((obj, index) => {
          return {
            id: index + 1,
            scheduledTimeText: obj.scheduledTimeText
              ? moment(obj.scheduledTimeText)?.format("DD-MM-YYYY HH:mm ")
              : "-",
          };
        })
      );
      setValue(
        "currentOccupierFirstName",
        !res?.currentOccupierFirstName
          ? "-"
          : language == "en"
          ? res?.currentOccupierFirstName
          : res?.currentOccupierFirstNameMr
      );
      // setIsAttach(res.transferTypeKey === 2 ? true : false);
      setValue(
        "currentOccupierMiddleName",
        !res?.currentOccupierMiddleName
          ? "-"
          : language == "en"
          ? res?.currentOccupierMiddleName
          : res?.currentOccupierMiddleNameMr
      );

      setValue(
        "currentOccupierLastName",
        !res?.currentOccupierLastName
          ? "-"
          : language == "en"
          ? res?.currentOccupierLastName
          : res?.currentOccupierLastNameMr
      );
      setValue(
        "currentOccupierMobileNo",
        res?.currentOccupierMobileNo !== null
          ? res?.currentOccupierMobileNo
          : "-"
      );
      setValue(
        "currentOccupierEmailId",
        res?.currentOccupierEmailId !== null ? res?.currentOccupierEmailId : "-"
      );
      setValue(
        "currentOccupierAadharNo",
        res?.currentOccupierAadharNo !== null
          ? res?.currentOccupierAadharNo
          : "-"
      );
      setValue("newHutNo", res !== null ? res?.hutNo : "-");
      setValue("hutNo", res !== null ? res?.oldHutNo : "-");
      setValue("oldHutNo", res !== null ? res?.oldHutNo : "-");
      setValue("transferDate", res !== null ? res?.transferDate : null);
      setValue("saleValue", res !== null ? res?.saleValue : "-");
      setValue("marketValue", res !== null ? res?.marketValue : "-");
      setValue("areaOfHut", res !== null ? res?.areaOfHut : "-");
      setValue("transferRemarks", res !== null ? res?.transferRemarks : "-");
      setValue(
        "transferTypeKey",
        res?.transferTypeKey === 1
          ? language === "en"
            ? "Sale Deed"
            : "विक्री करार"
          : language === "en"
          ? "Transfer by heredity"
          : "आनुवंशिकतेनुसार हस्तांतरण"
      );
      setValue(
        "proposedOwnerFirstName",
        !res?.proposedOwnerFirstName
          ? "-"
          : language == "en"
          ? res?.proposedOwnerFirstName
          : res?.proposedOwnerFirstNameMr
      );

      setValue(
        "proposedOwnerMiddleName",
        !res?.proposedOwnerMiddleName
          ? "-"
          : language == "en"
          ? res?.proposedOwnerMiddleName
          : res?.proposedOwnerMiddleNameMr
      );
      setValue(
        "proposedOwnerLastName",
        !res?.proposedOwnerLastName
          ? "-"
          : language == "en"
          ? res?.proposedOwnerLastName
          : res?.proposedOwnerLastNameMr
      );
      setValue("proposedOwnerMobileNo", res ? res?.proposedOwnerMobileNo : "-");
      setValue("proposedOwnerEmailId", res ? res?.proposedOwnerEmailId : "-");
      setValue("proposedOwnerAadharNo", res ? res?.proposedOwnerAadharNo : "-");
      // setPhoto(res?.proposedOwnerPhoto);
      setIsOverduePayment(res?.outstandingTax);

      setValue(
        "currentOwnerTitle",
        language == "en"
          ? titleData &&
              titleData.find((obj) => obj.id == res?.proposedOwnerTitle)?.title
          : titleData &&
              titleData.find((obj) => obj.id == res?.proposedOwnerTitle)
                ?.titleMr
      );
      setValue(
        "currentOccupierTitle",
        language == "en"
          ? titleData &&
              titleData.find((obj) => obj.id == res?.proposedOwnerTitle)?.title
          : titleData &&
              titleData.find((obj) => obj.id == res?.proposedOwnerTitle)
                ?.titleMr
      );
      setValue(
        "proposedOwnerTitleKey",
        language == "en"
          ? titleData &&
              titleData.find((obj) => obj.id == res?.proposedOwnerTitle)?.title
          : titleData &&
              titleData.find((obj) => obj.id == res?.proposedOwnerTitle)
                ?.titleMr
      );

      setApplicationNo(res?.applicationNo);
      setValue("clerkApprovalRemark", res?.clerkApprovalRemark);
      setValue("headClerkApprovalRemark", res?.headClerkApprovalRemark);
      setValue(
        "officeSuperintendantApprovalRemark",
        res.officeSuperintendantApprovalRemark
      );
      setValue(
        "administrativeOfficerApprovalRemark",
        res.administrativeOfficerApprovalRemark
      );
      setValue(
        "assistantCommissionerApprovalRemark",
        res?.assistantCommissionerApprovalRemark
      );
      setValue("finalApprovedRemark", res?.finalApprovedRemark);
      setCurrentStatus(manageStatus(res?.status, language, statusAll));
      setValue("visitTime", res?.trnVisitScheduleList[0]?.visitTime);
      setValue("slongitude", res?.trnVisitScheduleList[0]?.longitude);
      setValue("slattitude", res?.trnVisitScheduleList[0]?.lattitude);
      setValue("remarks", res?.trnVisitScheduleList[0]?.remarks);
      setValue("sgeocode", res?.trnVisitScheduleList[0]?.geocode);

      const doc = [];
      // Loop through each attached document and add it to the `doc` array
      for (let i = 1; i <= 5; i++) {
        const attachedDocument =
          res?.trnVisitScheduleList[0]?.[`siteImage${i}`];
        if (attachedDocument != null) {
          
          doc.push({
            id: i,
            filenm:DecryptData("passphraseaaaaaaaaupload",attachedDocument).split("/").pop().split("_").pop(),
            documentPath: attachedDocument,
            documentType: DecryptData("passphraseaaaaaaaaupload",attachedDocument).split(".").pop().toUpperCase(),
          });
        }
        setCompleteSiteVisitDoc(doc);
      }


      setDocList(
        res.transactionDocumentsList?.map((temp, index) => {
          return {
            id: temp.id,
            srNo: index + 1,
            fileName:
              documentList &&
              documentList?.find((obj) => obj.id === temp.documentKey)
                ?.documentChecklistMr,
            fileNameMr:
              documentList &&
              documentList?.find((obj) => obj.id === temp.documentKey)
                ?.documentChecklistMr,
            documentPath: temp.documentPath,
            documentKey: temp.documentKey,
            activeFlag: "Y",
          };
        })
      );
    }
    if (hutData != null) {
      let _list =
        hutData.mstHutMembersList &&
        hutData.mstHutMembersList?.map((each, i) => {
          return {
            id: i + 1,
            fullName: `${each.firstName} ${each.middleName} ${each.lastName}`,
            fullNameMr: `${each.firstNameMr} ${each.middleNameMr} ${each.lastNameMr}`,
            age: each.age,
            relationWithHeadOfFamily:
              relationDetails &&
              relationDetails.find((obj) => obj.id == each.relationKey)
                ?.relation,

            relationWithHeadOfFamilyMr:
              relationDetails &&
              relationDetails.find((obj) => obj.id == each.relationKey)
                ?.relationMr,
          };
        });
      setFamilyMembers(_list);
      let villageData1 =
        villageData && villageData.find((obj) => obj.id == hutData.villageKey);
      setValue(
        "villageKey",
        !villageData1
          ? "-"
          : language === "en"
          ? villageData1?.villageName
          : villageData1?.villageNameMr
      );

      setValue(
        "areaKey",
        language === "en"
          ? areaData &&
              areaData.find((obj) => obj.id == hutData?.areaKey)?.areaName
          : areaData &&
              areaData.find((obj) => obj.id == hutData?.areaKey)?.areaNameMr
      );

      setValue(
        "slumKey",
        language === "en"
          ? slumData &&
              slumData.find((obj) => obj.id == hutData?.slumKey)?.slumName
          : slumData &&
              slumData.find((obj) => obj.id == hutData?.slumKey)?.slumNameMr
      );

      setValue(
        "zoneKey",
        language === "en"
          ? zoneDetails &&
              zoneDetails.find((obj) => obj.id === hutData?.zoneKey)?.zoneName
          : zoneDetails &&
              zoneDetails.find((obj) => obj.id === hutData?.zoneKey)?.zoneNameMr
      );
    }
  }, [dataSource, hutData, language]);

  useEffect(() => {
    if (
      dataSource?.proposedOwnerPhoto != null &&
      dataSource?.proposedOwnerPhoto != undefined &&
      dataSource?.proposedOwnerPhoto != ""
    ) {
      getIcardPhoto(dataSource?.proposedOwnerPhoto);
    }
  }, [dataSource?.proposedOwnerPhoto]);

  // get title
  const getTitleData = () => {
    axios
      .get(`${urls.CFCURL}/master/title/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.title;
        setTitleData(result);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // get hut details by hut key
  const getHutData = (hutKey) => {
    axios
      .get(`${urls.SLUMURL}/mstHut/getById?id=${hutKey}`, {
        headers: headers,
      })
      .then((r) => {
        let res = r.data;
        setHutData(res);
        setValue("pincode", res ? res?.pincode : "-");
        setValue("lattitude", res ? res?.lattitude : "-");
        setValue("longitude", res ? res?.longitude : "-");
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get village details
  const getVillageData = () => {
    axios
      .get(`${urls.SLUMURL}/master/village/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.village;
        setVillageData(result);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get slum details
  const getSlumData = () => {
    axios
      .get(`${urls.SLUMURL}/mstSlum/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.mstSlumList;
        setSlumData(result);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get area details
  const getAreaData = () => {
    axios
      .get(`${urls.CFCURL}/master/area/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.area;
        setAreaData(result);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // get Zone Name
  const getZoneData = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let result = res.data.zone;
        setZoneDetails(result);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  const handleOnSubmit = (formData) => {
    if (btnSaveText === "accept") {
      callSiteVisit(formData);
    } else {
      btnSaveText === "finalApprove"
        ? sendBackToCitizen(true)
        : sendBackToCitizen(false);
    }
  };

  // call site visit api
  const callSiteVisit = (formData) => {
    let payload = {
      ...manageSiteVisitList[0],
      ...payloadImages,
      ...formData,
      trnType: "TFRH",
      referenceKey: Number(router.query.id),
      scheduleTokenNo: "123456",
      // rescheduleDate: formData.rescheduleTime &&moment(formData.rescheduleTime).format(
      //   "YYYY-MM-DDThh:mm:ss"
      // ),
      // rescheduleTimeText:formData.rescheduleTime&& moment(formData.rescheduleTime).format(
      //   "YYYY-MM-DDThh:mm:ss"
      // ),
      // scheduledTimeText:formData.scheduledTime&& moment(formData.scheduledTime).format(
      //   "YYYY-MM-DDThh:mm:ss"
      // ),
      rescheduleDate:
        formData.rescheduleTime &&
        moment(formData.rescheduleTime).format("YYYY-MM-DDTHH:mm:ss"),
      rescheduleTimeText:
        formData.rescheduleTime &&
        moment(formData.rescheduleTime).format("YYYY-MM-DDTHH:mm:ss"),
      scheduledTimeText:
        formData.scheduledTime &&
        moment(formData.scheduledTime).format("YYYY-MM-DDTHH:mm:ss"),
      slumKey: dataSource?.slumKey,
      hutNo: dataSource?.hutNo,
      length: hutData?.length,
      breadth: hutData?.breadth,
      height: hutData?.height,
      constructionTypeKey: hutData?.constructionTypeKey,
      usageTypeKey: hutData?.usageTypeKey,
      area: hutData?.areaOfHut,
      status: dataSource?.status,
      employeeKey: "2",
      geocode: formData?.sgeocode,
      lattitude: formData?.slattitude,
      longitude: formData?.slongitude,
      activeFlag: dataSource?.activeFlag,
      visitTimeText: moment(formData.visitTime).format("YYYY-MM-DDThh:mm:ss"),
      visitTime: moment(formData.visitTime).format("YYYY-MM-DDThh:mm:ss"),
      remarks: formData.remarks,
      isApproved: true,
      isRescheduled: watch("isRescheduled") === "true" ? true : false,
    };
    setIsLoading(true);
    const tempData = axios
      .post(`${urls.SLUMURL}/trnVisitSchedule/transferHut/save`, payload, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          sweetAlert({
            title: language === "en" ? "Saved!" : "जतन केले!",
            text:
              statusVal == 2
                ? language === "en"
                  ? `Site visit against ${dataSource.applicationNo} scheduled successfully !`
                  : ` साइट भेट ${dataSource.applicationNo} यशस्वीरित्या शेड्यूल केली!`
                : watch("isRescheduled") === "true"
                ? language === "en"
                  ? `Site visit against ${dataSource.applicationNo} rescheduled successfully !`
                  : ` साइट भेट ${dataSource.applicationNo} यशस्वीरित्या पुन्हा शेड्यूल केली!`
                : language === "en"
                ? `Site visit against ${dataSource.applicationNo} completed successfully !`
                : ` साइट भेट ${dataSource.applicationNo} यशस्वीरित्या पूर्ण केली!`,
            icon: "success",
            showCancelButton: false,
            confirmButtonText: language === "en" ? "Ok" : "ठीक आहे",
            allowOutsideClick: false, // Prevent closing on outside click
            allowEscapeKey: false, // Prevent closing on Esc key
            closeOnClickOutside: false, // Prevent closing on click outside
          }).then((will) => {
            if (will) {
              router.push(
                "/SlumBillingManagementSystem/transactions/hutTransfer/hutTransferDetails"
              );
            }
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  // Revert call
  const sendBackToCitizen = (isApproved) => {
    let isComplete = statusVal === 21 ? true : false;
    let data = {
      ...dataSource,
      isApproved: isApproved,
      clerkApprovalRemark: watch("clerkApprovalRemark"),
      officeSuperintendantApprovalRemark: watch(
        "officeSuperintendantApprovalRemark"
      ),
      administrativeOfficerApprovalRemark: watch(
        "administrativeOfficerApprovalRemark"
      ),
      headClerkApprovalRemark: watch("headClerkApprovalRemark"),
      assistantCommissionerApprovalRemark: watch(
        "assistantCommissionerApprovalRemark"
      ),
      finalApprovedRemark: watch("finalApprovedRemark"),
      isComplete,
    };
    setIsLoading(true);
    const tempData = axios
      .post(`${urls.SLUMURL}/trnTransferHut/save`, data, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          statusVal === 21
            ? sweetAlert({
                title: language === "en" ? "Approved!" : "मंजूर !",
                text:
                  language === "en"
                    ? `Hut Transfer ${dataSource.applicationNo} complete successfully !`
                    : `झोपडी हस्तांतरण ${dataSource.applicationNo}यशस्वीरित्या पूर्ण झाले!`,
                icon: "success",
                showCancelButton: false,
                confirmButtonText: language === "en" ? "Ok" : "ठीक आहे",
                allowOutsideClick: false, // Prevent closing on outside click
                allowEscapeKey: false, // Prevent closing on Esc key
                closeOnClickOutside: false, // Prevent closing on click outside
              }).then((will) => {
                if (will) {
                  router.push(
                    "/SlumBillingManagementSystem/transactions/hutTransfer/hutTransferDetails"
                  );
                }
              })
            : sweetAlert({
                title: isApproved
                  ? language === "en"
                    ? "Approved!"
                    : "मंजूर"
                  : language === "en"
                  ? "Revert!"
                  : "पूर्वस्थितीवर येणे!",
                text: isApproved
                  ? language === "en"
                    ? `Hut Transfer ${dataSource.applicationNo} Approved successfully !`
                    : `झोपडी हस्तांतरण ${dataSource.applicationNo} यशस्वीरित्या मंजूर केले!`
                  : language === "en"
                  ? `Hut Transfer ${dataSource.applicationNo} Reverted Back successfully !`
                  : `झोपडी हस्तांतरण ${dataSource.applicationNo} यशस्वीरित्या परत केले!`,
                icon: "success",
                showCancelButton: false,
                confirmButtonText: language === "en" ? "Ok" : "ठीक आहे",
                allowOutsideClick: false, // Prevent closing on outside click
                allowEscapeKey: false, // Prevent closing on Esc key
                closeOnClickOutside: false, // Prevent closing on click outside
              }).then((will) => {
                if (will) {
                  router.push(
                    "/SlumBillingManagementSystem/transactions/hutTransfer/hutTransferDetails"
                  );
                }
              });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  // Generate LOI
  const handleLOIButton = () => {
    let formData = {
      referenceKey: dataSource?.id,
      totalAmount: watch("totalAmount"),
      title: dataSource?.proposedOwnerTitle,
      middleName: dataSource?.proposedOwnerMiddleName,
      firstName: dataSource?.proposedOwnerFirstName,
      lastName: dataSource?.proposedOwnerLastName,
      mobileNo: dataSource?.proposedOwnerMobileNo,
    };
    setIsModalOpenForResolved(false);
    setIsLoading(true);
    const tempData = axios
      .post(`${urls.SLUMURL}/trnLoi/transferHut/save`, formData, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          sweetAlert({
            title: language === "en" ? "Generated!" : "उत्पन्न!",
            text:
              language === "en"
                ? `LOI against ${dataSource.applicationNo} generated Successfully !`
                : `लेटर ऑफ इंटेंट ${dataSource.applicationNo} यशस्वीरित्या उत्पन्न झाले!`,
            icon: "success",
            showCancelButton: false,
            confirmButtonText: language === "en" ? "Ok" : "ठीक आहे",
            allowOutsideClick: false, // Prevent closing on outside click
            allowEscapeKey: false, // Prevent closing on Esc key
            closeOnClickOutside: false, // Prevent closing on click outside
          }).then((will) => {
            if (will) {
              router.push({
                pathname:
                  "/SlumBillingManagementSystem/transactions/hutTransfer/hutTransferDetails",
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
                    <FormattedLabel id="hutTransfer" />
                  </h3>
                </Grid>
              </Grid>
            </Box>
            {/* Current status and application No */}
            <Grid container spacing={2} sx={{ padding: "1rem" }}>
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
                {photo ? (
                  <img
                    src={`data:image/png;base64,${photo}`}
                    alt="अर्जदाराचा फोटो"
                    height="150px"
                    width="144px"
                  />
                ) : (
                  <h4>अर्जदाराचा फोटो</h4>
                )}
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
            {/* Old hut no */}
            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="oldHutNo" />}
                  variant="standard"
                  disabled={true}
                  {...register("hutNo")}
                  InputLabelProps={{
                    shrink: watch("hutNo") ? true : false,
                  }}
                  error={!!error.hutNo}
                  helperText={error?.hutNo ? error.hutNo.message : null}
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
                    <FormattedLabel id="hutOwnerDetails" />
                  </h3>
                </Grid>
              </Grid>
            </Box>
            {/* hut owners details */}
            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  disabled={true}
                  label={<FormattedLabel id="title" />}
                  variant="standard"
                  value={watch("currentOwnerTitle")}
                  InputLabelProps={{
                    shrink: watch("currentOwnerTitle") ? true : false,
                  }}
                  error={!!error.currentOwnerTitle}
                  helperText={
                    error?.currentOwnerTitle
                      ? error.currentOwnerTitle.message
                      : null
                  }
                />
              </Grid>

              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  disabled={true}
                  label={<FormattedLabel id="firstName" />}
                  variant="standard"
                  value={watch("currentOwnerFirstName")}
                  InputLabelProps={{
                    shrink: watch("currentOwnerFirstName") ? true : false,
                  }}
                  error={!!error.currentOwnerFirstName}
                  helperText={
                    error?.currentOwnerFirstName
                      ? error.currentOwnerFirstName.message
                      : null
                  }
                />
              </Grid>
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  disabled={true}
                  label={<FormattedLabel id="middleName" />}
                  variant="standard"
                  value={watch("currentOwnerMiddleName")}
                  InputLabelProps={{
                    shrink: watch("currentOwnerMiddleName") ? true : false,
                  }}
                  error={!!error.currentOwnerMiddleName}
                  helperText={
                    error?.currentOwnerMiddleName
                      ? error.currentOwnerMiddleName.message
                      : null
                  }
                />
              </Grid>
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  disabled={true}
                  label={<FormattedLabel id="lastName" />}
                  variant="standard"
                  value={watch("currentOwnerLastName")}
                  InputLabelProps={{
                    shrink: watch("currentOwnerLastName") ? true : false,
                  }}
                  error={!!error.currentOwnerLastName}
                  helperText={
                    error?.currentOwnerLastName
                      ? error.currentOwnerLastName.message
                      : null
                  }
                />
              </Grid>
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  disabled={true}
                  label={<FormattedLabel id="mobileNo" />}
                  variant="standard"
                  value={watch("currentOwnerMobileNo")}
                  InputLabelProps={{
                    shrink: watch("currentOwnerMobileNo") ? true : false,
                  }}
                  error={!!error.currentOwnerMobileNo}
                  helperText={
                    error?.currentOwnerMobileNo
                      ? error.currentOwnerMobileNo.message
                      : null
                  }
                />
              </Grid>
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  disabled={true}
                  label={<FormattedLabel id="aadharNo" />}
                  variant="standard"
                  value={watch("currentOwnerAadharNo")}
                  InputLabelProps={{
                    shrink: watch("currentOwnerAadharNo") ? true : false,
                  }}
                  error={!!error.currentOwnerAadharNo}
                  helperText={
                    error?.currentOwnerAadharNo
                      ? error.currentOwnerAadharNo.message
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
                    <FormattedLabel id="familyMemberDetails" />
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
                rows={familyMembers}
                columns={memberColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
              />
            </Grid>
            {/* Hut Address Details */}
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
                    <FormattedLabel id="hutAddressDetails" />
                  </h3>
                </Grid>
              </Grid>
            </Box>
            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  disabled={true}
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
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  disabled={true}
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
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  disabled={true}
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
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  disabled={true}
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
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  disabled={true}
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
            {/********* Transfer Details *********/}
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
                    <FormattedLabel id="transferDetails" />
                  </h3>
                </Grid>
              </Grid>
            </Box>
            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  disabled={true}
                  label={<FormattedLabel id="transferType" />}
                  variant="standard"
                  value={watch("transferTypeKey")}
                  InputLabelProps={{
                    shrink: watch("transferTypeKey") ? true : false,
                  }}
                  error={!!error.transferTypeKey}
                  helperText={
                    error?.transferTypeKey
                      ? error.transferTypeKey.message
                      : null
                  }
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
                      <FormattedLabel id="attachFile" />
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
                  rows={docList}
                  columns={attachFileColumns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                />
              </Grid>
            </>
            {/* Proposed owner Details */}
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
                    <FormattedLabel id="newOwnerDetails" />
                  </h3>
                </Grid>
              </Grid>
            </Box>
            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  disabled={true}
                  label={<FormattedLabel id="proposedOwnerTitle" />}
                  variant="standard"
                  value={watch("proposedOwnerTitleKey")}
                  InputLabelProps={{
                    shrink: watch("proposedOwnerTitleKey") ? true : false,
                  }}
                  error={!!error.proposedOwnerTitleKey}
                  helperText={
                    error?.proposedOwnerTitleKey
                      ? error.proposedOwnerTitleKey.message
                      : null
                  }
                />
              </Grid>
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  disabled={true}
                  label={<FormattedLabel id="proposedOwnerFirstName" />}
                  variant="standard"
                  value={watch("proposedOwnerFirstName")}
                  InputLabelProps={{
                    shrink: watch("proposedOwnerFirstName") ? true : false,
                  }}
                  error={!!error.proposedOwnerFirstName}
                  helperText={
                    error?.proposedOwnerFirstName
                      ? error.proposedOwnerFirstName.message
                      : null
                  }
                />
              </Grid>
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  disabled={true}
                  label={<FormattedLabel id="proposedOwnerMiddleName" />}
                  variant="standard"
                  value={watch("proposedOwnerMiddleName")}
                  InputLabelProps={{
                    shrink: watch("proposedOwnerMiddleName") ? true : false,
                  }}
                  error={!!error.proposedOwnerMiddleName}
                  helperText={
                    error?.proposedOwnerMiddleName
                      ? error.proposedOwnerMiddleName.message
                      : null
                  }
                />
              </Grid>
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  disabled={true}
                  label={<FormattedLabel id="proposedOwnerLastName" />}
                  variant="standard"
                  value={watch("proposedOwnerLastName")}
                  InputLabelProps={{
                    shrink: watch("proposedOwnerLastName") ? true : false,
                  }}
                  error={!!error.proposedOwnerLastName}
                  helperText={
                    error?.proposedOwnerLastName
                      ? error.proposedOwnerLastName.message
                      : null
                  }
                />
              </Grid>
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  disabled={true}
                  label={<FormattedLabel id="proposedOwnerMobileNo" />}
                  variant="standard"
                  value={watch("proposedOwnerMobileNo")}
                  InputLabelProps={{
                    shrink: watch("proposedOwnerMobileNo") ? true : false,
                  }}
                  error={!!error.proposedOwnerMobileNo}
                  helperText={
                    error?.proposedOwnerMobileNo
                      ? error.proposedOwnerMobileNo.message
                      : null
                  }
                />
              </Grid>
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  disabled={true}
                  label={<FormattedLabel id="proposedOwnerAadharNo" />}
                  variant="standard"
                  value={watch("proposedOwnerAadharNo")}
                  InputLabelProps={{
                    shrink: watch("proposedOwnerAadharNo") ? true : false,
                  }}
                  error={!!error.proposedOwnerAadharNo}
                  helperText={
                    error?.proposedOwnerAadharNo
                      ? error.proposedOwnerAadharNo.message
                      : null
                  }
                />
              </Grid>
            </Grid>
            {/* accept revert button*/}
            {(statusVal === 1 || statusVal === 2) &&
              authority &&
              authority.find((val) => val === commonRoleId.ROLE_CLERK) && (
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
                  <FormControl flexDirection="row">
                    <Controller
                      {...register("isRejected")}
                      name="isRejected"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <RadioGroup
                          value={statusVal !== 2 ? "false" : field.value}
                          selected={field.value}
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                        >
                          <FormControlLabel
                            {...register("isRejected")}
                            disabled={statusVal !== 2}
                            value={"true"}
                            // value={statusVal !== 2 ? "false" : field.value}
                            onChange={(e) => {
                              field.onChange(e);
                              setValidationSchema(schemaForSiteVisitDoneTrue);
                            }}
                            control={<Radio />}
                            label={<FormattedLabel id="accept" />}
                            error={!!error.isRejected}
                            helperText={
                              error?.isRejected
                                ? error.isRejected.message
                                : null
                            }
                          />
                          <FormControlLabel
                            {...register("isRejected")}
                            value={"false"}
                            // value={statusVal !== 2 ? "false" : field.value}
                            onChange={(e) => {
                              field.onChange(e);
                              setValidationSchema(schemaForSiteVisitDoneTrue);
                            }}
                            disabled={statusVal != 2}
                            control={<Radio />}
                            label={<FormattedLabel id="revert" />}
                            error={!!error.isRejected}
                            helperText={
                              error?.isRejected
                                ? error.isRejected.message
                                : null
                            }
                          />
                        </RadioGroup>
                      )}
                    />
                  </FormControl>
                </Grid>
              )}
            {/* revert section */}
            {((watch("isRejected") === "false" &&
              authority &&
              authority.find((val) => val === commonRoleId.ROLE_CLERK)) ||
              statusVal == 1) && (
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
                        <FormattedLabel id="revertSection" />
                      </h3>
                    </Grid>
                  </Grid>
                </Box>
                <Grid container spacing={2} sx={{ padding: "1rem" }}>
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      label={<FormattedLabel id="revertedRemark" />}
                      id="standard-textarea"
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      variant="standard"
                      multiline
                      disabled={statusVal === 1}
                      inputProps={{ maxLength: 500 }}
                      {...register("clerkApprovalRemark")}
                      error={!!error.clerkApprovalRemark}
                      helperText={
                        error?.clerkApprovalRemark
                          ? error.clerkApprovalRemark.message
                          : null
                      }
                    />
                  </Grid>
                </Grid>
              </>
            )}
            {/* schedule site visit */}
            {statusVal != 1 && statusVal != 0 && (
              <>
                {((watch("isRejected") === "true" &&
                  authority &&
                  authority.find((val) => val === commonRoleId.ROLE_CLERK) &&
                  statusVal == 2 &&
                  statusVal != 1) ||
                  statusVal != 2) && (
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
                            <FormattedLabel id="scheduleSiteVisit" />
                          </h3>
                        </Grid>
                      </Grid>
                    </Box>

                    {scheduleList.length != 0 && statusVal != 2 && (
                      <DataGrid
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
                        pageSize={10}
                        density="standard"
                        pagination={{ pageSizeOptions: [10, 20, 50, 100] }}
                        rows={scheduleList}
                        columns={columns}
                      />
                    )}

                    <Grid container spacing={2} sx={{ padding: "1rem" }}>
                      {statusVal === 2 && (
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                          <Controller
                            control={control}
                            name="scheduledTime"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DateTimePicker
                                  disablePast
                                  {...field}
                                  renderInput={(props) => (
                                    <TextField
                                      {...props}
                                      size="small"
                                      fullWidth
                                      sx={{
                                        m: { xs: 0, md: 1 },
                                        minWidth: "100%",
                                      }}
                                      error={error.scheduledTime}
                                      helperText={
                                        error?.scheduledTime
                                          ? error.scheduledTime.message
                                          : null
                                      }
                                    />
                                  )}
                                  label={
                                    <FormattedLabel
                                      id="scheduleDateTime"
                                      required
                                    />
                                  }
                                  onChange={(date) => {
                                    const formattedDate =
                                      moment(date).format("YYYY-MM-DD");
                                    const formattedTime =
                                      moment(date).format("hh:mm:ss A");
                                    field.onChange(
                                      `${formattedDate} ${formattedTime}`
                                    );
                                  }}
                                  value={
                                    field.value
                                      ? moment(
                                          field.value,
                                          "YYYY-MM-DD hh:mm:ss A"
                                        )
                                      : null
                                  }
                                  defaultValue={null}
                                  disabled={statusVal == 15}
                                  inputFormat="YYYY-MM-DD hh:mm:ss A"
                                />
                              </LocalizationProvider>
                            )}
                          />
                        </Grid>
                      )}

                      {authority &&
                        authority.find(
                          (val) => val === commonRoleId.ROLE_CLERK
                        ) &&
                        (statusVal == 15 || statusVal == 28) && (
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
                            <FormControl flexDirection="row">
                              <Controller
                                {...register("isRescheduled")}
                                name="isRescheduled"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                  <RadioGroup
                                    value={field.value}
                                    selected={field.value}
                                    row
                                    disabled={true}
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                  >
                                    <FormControlLabel
                                      {...register("isRescheduled")}
                                      value={"true"}
                                      control={<Radio />}
                                      label={
                                        <FormattedLabel id="isRescheduled" />
                                      }
                                      error={!!error.isRescheduled}
                                      helperText={
                                        error?.isRescheduled
                                          ? error.isRescheduled.message
                                          : null
                                      }
                                    />
                                    <FormControlLabel
                                      {...register("isRescheduled")}
                                      value={"false"}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        setValidationSchema(
                                          schemaForSiteVisitDoneFalse
                                        );
                                      }}
                                      control={<Radio />}
                                      label={
                                        <FormattedLabel id="siteVisitDone" />
                                      }
                                      error={!!error.isRescheduled}
                                      helperText={
                                        error?.isRescheduled
                                          ? error.isRescheduled.message
                                          : null
                                      }
                                    />
                                  </RadioGroup>
                                )}
                              />
                            </FormControl>
                          </Grid>
                        )}

                      {watch("isRescheduled") == "true" && (
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                          <Controller
                            control={control}
                            name="rescheduleTime"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DateTimePicker
                                  disablePast
                                  {...field}
                                  renderInput={(props) => (
                                    <TextField
                                      {...props}
                                      size="small"
                                      fullWidth
                                      sx={{
                                        m: { xs: 0, md: 1 },
                                        minWidth: "100%",
                                      }}
                                      error={error.rescheduleTime}
                                      helperText={
                                        error?.rescheduleTime
                                          ? error.rescheduleTime.message
                                          : null
                                      }
                                    />
                                  )}
                                  label={
                                    <FormattedLabel id="rescheduleDateTime" />
                                  }
                                  // value={field.value}
                                  // onChange={(date) =>
                                  //   field.onChange(
                                  //     moment(date).format("YYYY-MM-DDThh:mm:ss")
                                  //   )
                                  // }
                                  // defaultValue={null}
                                  // disabled={statusVal == 2}
                                  // inputFormat="YYYY-MM-DDThh:mm:ss"

                                  onChange={(date) => {
                                    const formattedDate =
                                      moment(date).format("YYYY-MM-DD");
                                    const formattedTime =
                                      moment(date).format("hh:mm:ss A");
                                    field.onChange(
                                      `${formattedDate} ${formattedTime}`
                                    );
                                  }}
                                  value={
                                    field.value
                                      ? moment(
                                          field.value,
                                          "YYYY-MM-DD hh:mm:ss A"
                                        )
                                      : null
                                  }
                                  defaultValue={null}
                                  disabled={statusVal == 2}
                                  inputFormat="YYYY-MM-DD hh:mm:ss A"
                                />
                              </LocalizationProvider>
                            )}
                          />
                        </Grid>
                      )}
                    </Grid>

                    {/* complete site visit */}
                    {((watch("isRescheduled") === "false" &&
                      authority &&
                      authority.find(
                        (val) => val === commonRoleId.ROLE_CLERK
                      ) &&
                      (statusVal === 15 || statusVal == 28)) ||
                      (statusVal != 2 &&
                        statusVal != 15 &&
                        statusVal != 28)) && (
                      <>
                        {" "}
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
                                <FormattedLabel id="transferHutSiteDetails" />
                              </h3>
                            </Grid>
                          </Grid>
                        </Box>
                        <Grid container spacing={2} sx={{ padding: "1rem" }}>
                          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                            <Controller
                              control={control}
                              name="scheduledTime"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DateTimePicker
                                    disablePast
                                    {...field}
                                    renderInput={(props) => (
                                      <TextField
                                        {...props}
                                        size="small"
                                        fullWidth
                                        sx={{
                                          m: { xs: 0, md: 1 },
                                          minWidth: "100%",
                                        }}
                                        error={error.scheduledTime}
                                        helperText={
                                          error?.scheduledTime
                                            ? error.scheduledTime.message
                                            : null
                                        }
                                      />
                                    )}
                                    label={
                                      <FormattedLabel id="scheduleDateTime" />
                                    }
                                    onChange={(date) => {
                                      const formattedDate =
                                        moment(date).format("YYYY-MM-DD");
                                      const formattedTime =
                                        moment(date).format("hh:mm:ss A");
                                      field.onChange(
                                        `${formattedDate} ${formattedTime}`
                                      );
                                    }}
                                    value={
                                      field.value
                                        ? moment(
                                            field.value,
                                            "YYYY-MM-DD hh:mm:ss A"
                                          )
                                        : null
                                    }
                                    defaultValue={null}
                                    disabled
                                    inputFormat="YYYY-MM-DD hh:mm:ss A"
                                  />
                                </LocalizationProvider>
                              )}
                            />
                          </Grid>
                          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                            <Controller
                              control={control}
                              name="visitTime"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DateTimePicker
                                    {...field}
                                    disabled={
                                      statusVal != 15 && statusVal != 28
                                    }
                                    renderInput={(props) => (
                                      <TextField
                                        {...props}
                                        size="small"
                                        fullWidth
                                        sx={{
                                          m: { xs: 0, md: 1 },
                                          minWidth: "100%",
                                        }}
                                        error={error.visitTime}
                                        helperText={
                                          error?.visitTime
                                            ? error.visitTime.message
                                            : null
                                        }
                                      />
                                    )}
                                    label={
                                      <FormattedLabel
                                        id="visitDateTime"
                                        required
                                      />
                                    }
                                    // value={field.value}
                                    // onChange={(date) =>
                                    //   field.onChange(
                                    //     moment(date).format(
                                    //       "YYYY-MM-DDThh:mm:ss"
                                    //     )
                                    //   )
                                    // }
                                    // defaultValue={null}
                                    // inputFormat="YYYY-MM-DDThh:mm:ss"
                                    onChange={(date) => {
                                      const formattedDate =
                                        moment(date).format("YYYY-MM-DD");
                                      const formattedTime =
                                        moment(date).format("hh:mm:ss A");
                                      field.onChange(
                                        `${formattedDate} ${formattedTime}`
                                      );
                                    }}
                                    value={
                                      field.value
                                        ? moment(
                                            field.value,
                                            "YYYY-MM-DD hh:mm:ss A"
                                          )
                                        : null
                                    }
                                    defaultValue={null}
                                    inputFormat="YYYY-MM-DD hh:mm:ss A"
                                  />
                                </LocalizationProvider>
                              )}
                            />
                          </Grid>
                          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                            <TextField
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              label={<FormattedLabel id="lattitude" required />}
                              variant="standard"
                              disabled={statusVal != 15 && statusVal != 28}
                              {...register("slattitude")}
                              InputLabelProps={{
                                shrink: watch("slattitude") ? true : false,
                              }}
                              error={!!error.slattitude}
                              helperText={
                                error?.slattitude
                                  ? error.slattitude.message
                                  : null
                              }
                            />
                          </Grid>
                          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                            <TextField
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              label={<FormattedLabel id="longitude" required />}
                              variant="standard"
                              disabled={statusVal != 15 && statusVal != 28}
                              {...register("slongitude")}
                              InputLabelProps={{
                                shrink: watch("slongitude") ? true : false,
                              }}
                              error={!!error.slongitude}
                              helperText={
                                error?.slongitude
                                  ? error.slongitude.message
                                  : null
                              }
                            />
                          </Grid>
                          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                            <TextField
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              label={<FormattedLabel id="geocode" required />}
                              variant="standard"
                              disabled={statusVal != 15 && statusVal != 28}
                              {...register("sgeocode")}
                              InputLabelProps={{
                                shrink: watch("sgeocode") ? true : false,
                              }}
                              error={!!error.sgeocode}
                              helperText={
                                error?.sgeocode ? error.sgeocode.message : null
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
                        {statusVal != 15 && statusVal != 28 ? (
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
                            rows={completeSiteVisitDoc}
                            columns={docColumns}
                          />
                        ) : (
                          <Grid container spacing={2} sx={{ padding: "1rem" }}>
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                              <FileTable
                                appName="SLUM" //Module Name
                                serviceName="SLUM-IssuancePhotopass" //Transaction Name
                                fileName={attachedFile} //State to attach file
                                filePath={setAttachedFile} // File state upadtion function
                                newFilesFn={setAdditionalFiles} // File data function
                                columns={_columns} //columns for the table
                                rows={finalFiles} //state to be displayed in table
                                uploading={setUploading}
                                getValues={getValues}
                                pageMode={router.query.pageMode}
                                authorizedToUpload={authorizedToUpload}
                              />
                            </Grid>
                          </Grid>
                        )}
                        {/* <Box
                          style={{
                            marginTop: "10px",
                            display: "flex",
                            justifyContent: "center",
                            paddingTop: "10px",
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
                            <Grid
                              item
                              xl={1}
                              lg={1}
                              md={1}
                              sm={1}
                              xs={1}
                            ></Grid>
                            <Grid item xl={9} lg={9} md={9} sm={9} xs={12}>
                              <label>
                                <b>
                                  <FormattedLabel id="generateInspectionReport" />
                                </b>
                              </label>
                            </Grid>

                            <Grid item xl={2} lg={2} md={2} sm={2} xs={12}>
                              <Button
                                color="primary"
                                variant="contained"
                                size="small"
                              >
                                <FormattedLabel id="generate" />
                              </Button>
                            </Grid>
                          </Grid> */}

                          <Grid container spacing={2} sx={{ padding: "1rem" }}>
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                              <TextField
                                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                label={<FormattedLabel id="remarks" />}
                                variant="standard"
                                inputProps={{ maxLength: 1000 }}
                                disabled={statusVal != 15 && statusVal != 28}
                                {...register("remarks")}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                multiline
                                onChange={(e) =>
                                  handleRemarkChange(
                                    e,
                                    "completeApprovalRemark"
                                  )
                                }
                                error={!!error.remarks}
                                helperText={
                                  error?.remarks ? error.remarks.message : null
                                }
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </>
                    )}
                  </>
                )}

                {/* Approval section */}
                {
                  <>
                    {((statusVal != 15 &&
                      statusVal != 28 &&
                      statusVal != 16 &&
                      statusVal != 2 &&
                      statusVal != 13 &&
                      statusVal != 14) ||
                      (authority &&
                        authority.find(
                          (val) => val === commonRoleId.ROLE_CLERK
                        ) &&
                        statusVal == 14)) && (
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
                                <FormattedLabel id="approvalSection" />
                              </h3>
                            </Grid>
                          </Grid>
                        </Box>
                        <Grid container spacing={2} sx={{ padding: "1rem" }}>
                          {((authority &&
                            authority.find(
                              (val) => val === commonRoleId.ROLE_CLERK
                            ) &&
                            (statusVal == 14 || statusVal == 26)) ||
                            (statusVal != 15 &&
                              statusVal != 28 &&
                              statusVal != 16) ||
                            watch("clerkApprovalRemark")) && (
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                              <TextField
                                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                label={<FormattedLabel id="clearkRemarks" />}
                                variant="standard"
                                disabled={
                                  authority &&
                                  authority.find(
                                    (val) => val == commonRoleId.ROLE_CLERK
                                  ) &&
                                  (statusVal == 14 || statusVal == 26)
                                    ? false
                                    : true
                                }
                                {...register("clerkApprovalRemark")}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                inputProps={{ maxLength: 500 }}
                                onChange={(e) =>
                                  handleRemarkChange(e, "clerkApprovalRemark")
                                }
                                multiline
                                error={!!error.clerkApprovalRemark}
                                helperText={
                                  error?.clerkApprovalRemark
                                    ? error.clerkApprovalRemark.message
                                    : null
                                }
                              />
                            </Grid>
                          )}

                          {((authority &&
                            authority.find(
                              (val) => val === commonRoleId.ROLE_HEAD_CLERK
                            ) &&
                            statusVal == 5) ||
                            watch("headClerkApprovalRemark") ||
                            (statusVal != 5 &&
                              statusVal != 15 &&
                              statusVal != 28 &&
                              statusVal != 16 &&
                              statusVal != 14)) && (
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                              <TextField
                                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                label={
                                  <FormattedLabel id="headClerkApprovalRemark" />
                                }
                                variant="standard"
                                disabled={
                                  authority &&
                                  authority.find(
                                    (val) => val == commonRoleId.ROLE_HEAD_CLERK
                                  ) &&
                                  statusVal == 5
                                    ? false
                                    : true
                                }
                                {...register("headClerkApprovalRemark")}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                inputProps={{ maxLength: 500 }}
                                multiline
                                onChange={(e) =>
                                  handleRemarkChange(
                                    e,
                                    "headClerkApprovalRemark"
                                  )
                                }
                                error={!!error.headClerkApprovalRemark}
                                helperText={
                                  error?.headClerkApprovalRemark
                                    ? error.headClerkApprovalRemark.message
                                    : null
                                }
                              />
                            </Grid>
                          )}

                          {((authority &&
                            authority.find(
                              (val) =>
                                val ===
                                  commonRoleId.ROLE_OFFICE_SUPERINTENDANT &&
                                statusVal == 7
                            )) ||
                            watch("officeSuperintendantApprovalRemark") ||
                            statusVal == 9 ||
                            statusVal === 11 ||
                            statusVal == 21 ||
                            statusVal === 17) && (
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                              <TextField
                                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                label={
                                  <FormattedLabel id="officeSuperintendantApprovalRemark" />
                                }
                                variant="standard"
                                disabled={
                                  authority &&
                                  authority.find(
                                    (val) =>
                                      val ==
                                      commonRoleId.ROLE_OFFICE_SUPERINTENDANT
                                  ) &&
                                  statusVal == 7
                                    ? false
                                    : true
                                }
                                {...register(
                                  "officeSuperintendantApprovalRemark"
                                )}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                inputProps={{ maxLength: 500 }}
                                multiline
                                onChange={(e) =>
                                  handleRemarkChange(
                                    e,
                                    "officeSuperintendantApprovalRemark"
                                  )
                                }
                                error={
                                  !!error.officeSuperintendantApprovalRemark
                                }
                                helperText={
                                  error?.officeSuperintendantApprovalRemark
                                    ? error.officeSuperintendantApprovalRemark
                                        .message
                                    : null
                                }
                              />
                            </Grid>
                          )}

                          {((authority &&
                            authority.find(
                              (val) =>
                                val ===
                                  commonRoleId.ROLE_ADMINISTRATIVE_OFFICER &&
                                statusVal == 9
                            )) ||
                            statusVal === 11 ||
                            statusVal == 21 ||
                            statusVal === 17 ||
                            watch("administrativeOfficerApprovalRemark")) && (
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                              <TextField
                                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                label={
                                  <FormattedLabel id="administrativeOfficerApprovalRemark" />
                                }
                                variant="standard"
                                inputProps={{ maxLength: 500 }}
                                disabled={
                                  authority &&
                                  authority.find(
                                    (val) =>
                                      val ==
                                      commonRoleId.ROLE_ADMINISTRATIVE_OFFICER
                                  ) &&
                                  statusVal == 9
                                    ? false
                                    : true
                                }
                                {...register(
                                  "administrativeOfficerApprovalRemark"
                                )}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                onChange={(e) =>
                                  handleRemarkChange(
                                    e,
                                    "administrativeOfficerApprovalRemark"
                                  )
                                }
                                multiline
                                error={
                                  !!error.administrativeOfficerApprovalRemark
                                }
                                helperText={
                                  error?.administrativeOfficerApprovalRemark
                                    ? error.administrativeOfficerApprovalRemark
                                        .message
                                    : null
                                }
                              />
                            </Grid>
                          )}

                          {((authority &&
                            authority.find(
                              (val) =>
                                val ===
                                  commonRoleId.ROLE_ASSISTANT_COMMISHIONER &&
                                statusVal == 11
                            )) ||
                            statusVal == 21 ||
                            watch("assistantCommissionerApprovalRemark") ||
                            statusVal === 17) && (
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                              <TextField
                                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                label={
                                  <FormattedLabel id="assistantCommissionerApprovalRemark" />
                                }
                                variant="standard"
                                disabled={
                                  statusVal != 1 &&
                                  statusVal != 2 &&
                                  statusVal != 11
                                }
                                {...register(
                                  "assistantCommissionerApprovalRemark"
                                )}
                                multiline
                                inputProps={{ maxLength: 500 }}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                onChange={(e) =>
                                  handleRemarkChange(
                                    e,
                                    "assistantCommissionerApprovalRemark"
                                  )
                                }
                                error={
                                  !!error.assistantCommissionerApprovalRemark
                                }
                                helperText={
                                  error?.assistantCommissionerApprovalRemark
                                    ? error.assistantCommissionerApprovalRemark
                                        .message
                                    : null
                                }
                              />
                            </Grid>
                          )}

                          {((authority &&
                            authority.find(
                              (val) => val === commonRoleId.ROLE_CLERK
                            ) &&
                            statusVal == 21) ||
                            watch("finalApprovedRemark") ||
                            statusVal === 17) && (
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                              <TextField
                                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                label={
                                  <FormattedLabel id="finalApprovedRemark" />
                                }
                                variant="standard"
                                disabled={
                                  statusVal != 1 &&
                                  statusVal != 2 &&
                                  statusVal != 21
                                }
                                {...register("finalApprovedRemark")}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                multiline
                                onChange={(e) =>
                                  handleRemarkChange(e, "finalApprovedRemark")
                                }
                                inputProps={{ maxLength: 500 }}
                                error={!!error.finalApprovedRemark}
                                helperText={
                                  error?.finalApprovedRemark
                                    ? error.finalApprovedRemark.message
                                    : null
                                }
                              />
                            </Grid>
                          )}
                        </Grid>
                      </>
                    )}
                  </>
                }
              </>
            )}{" "}
            {/* Buttons Row */}
            {
              <Grid container spacing={2} sx={{ padding: "1rem" }}>
                {loggedInUser !== "citizenUser" && (
                  <>
                    <Grid
                      item
                      xl={
                        checkSomeCondition()
                          ? 4
                          : ((watch("isRejected") || watch("isRescheduled")) &&
                              (statusVal == 15 ||
                                statusVal === 2 ||
                                statusVal === 28)) ||
                            ((statusVal === 16 ||
                              statusVal === 21 ||
                              statusVal === 14) &&
                              authority &&
                              authority.find(
                                (val) => val === commonRoleId.ROLE_CLERK
                              ))
                          ? 6
                          : 12
                      }
                      lg={
                        checkSomeCondition()
                          ? 4
                          : ((watch("isRejected") || watch("isRescheduled")) &&
                              (statusVal == 15 ||
                                statusVal === 2 ||
                                statusVal === 28)) ||
                            ((statusVal === 16 ||
                              statusVal === 21 ||
                              statusVal === 14) &&
                              authority &&
                              authority.find(
                                (val) => val === commonRoleId.ROLE_CLERK
                              ))
                          ? 6
                          : 12
                      }
                      md={
                        checkSomeCondition()
                          ? 4
                          : ((watch("isRejected") || watch("isRescheduled")) &&
                              (statusVal == 15 ||
                                statusVal === 2 ||
                                statusVal === 28)) ||
                            ((statusVal === 16 ||
                              statusVal === 21 ||
                              statusVal === 14) &&
                              authority &&
                              authority.find(
                                (val) => val === commonRoleId.ROLE_CLERK
                              ))
                          ? 6
                          : 12
                      }
                      sm={
                        checkSomeCondition()
                          ? 4
                          : ((watch("isRejected") || watch("isRescheduled")) &&
                              (statusVal == 15 ||
                                statusVal === 2 ||
                                statusVal === 28)) ||
                            ((statusVal === 16 ||
                              statusVal === 21 ||
                              statusVal === 14) &&
                              authority &&
                              authority.find(
                                (val) => val === commonRoleId.ROLE_CLERK
                              ))
                          ? 6
                          : 12
                      }
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
                        color="error"
                        size="small"
                        endIcon={<ExitToApp />}
                        onClick={() => {
                          if(loggedInUser==='citizenUser'){
                            router.push("/dashboard");
                          }else if(loggedInUser==='cfcUser'){
                            router.push("/CFC_Dashboard");
                          } else {
                            router.push(
                              `/SlumBillingManagementSystem/transactions/hutTransfer/hutTransferDetails`
                            );
                          }
                        }}
                      >
                        <FormattedLabel id="exit" />
                      </Button>
                    </Grid>

                    {(watch("isRejected") === "true" ||
                      watch("isRescheduled")) &&
                      (statusVal == 15 ||
                        statusVal === 2 ||
                        statusVal === 28) && (
                        <>
                          {statusVal === 2 && (
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
                                color="success"
                                variant="contained"
                                size="small"
                                type="submit"
                                disabled={
                                  isOverduePayment ||
                                  loggedInUser === "citizenUser" ||
                                  checkAuth() ||
                                  !watch("scheduledTime")
                                }
                                onClick={() => {
                                  setBtnSaveText("accept");
                                  // setIsScheduled("true");
                                }}
                                endIcon={<Save />}
                              >
                                {statusVal == 2 && (
                                  <FormattedLabel id="scheduleSiteVisit" />
                                )}
                              </Button>
                            </Grid>
                          )}
                          {watch("isRescheduled") === "true" && (
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
                                color="success"
                                variant="contained"
                                size="small"
                                type="submit"
                                disabled={
                                  isOverduePayment ||
                                  loggedInUser === "citizenUser" ||
                                  checkAuth() ||
                                  !watch("rescheduleTime") ||
                                  watch("isRescheduled") !== "true"
                                }
                                onClick={() => {
                                  setBtnSaveText("accept");
                                }}
                                endIcon={<Save />}
                              >
                                {watch("isRescheduled") === "true" && (
                                  <FormattedLabel id="reScheduleSiteVisit" />
                                )}
                              </Button>
                            </Grid>
                          )}
                          {watch("isRescheduled") === "false" && (
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
                                color="success"
                                variant="contained"
                                size="small"
                                type="submit"
                                disabled={
                                  isOverduePayment ||
                                  loggedInUser === "citizenUser" ||
                                  checkAuth() ||
                                  !isRemarksFilled
                                }
                                onClick={() => {
                                  setBtnSaveText("accept");
                                  handleCompleteSiteVisit(false); // Call your handler when the button is clicked
                                }}
                                endIcon={<Save />}
                              >
                                {watch("isRescheduled") === "false" && (
                                  <FormattedLabel id="completeSiteVisit" />
                                )}
                              </Button>
                            </Grid>
                          )}
                        </>
                      )}
                    {watch("isRejected") === "false" && (
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
                          color="secondary"
                          variant="contained"
                          type="submit"
                          size="small"
                          disabled={
                            loggedInUser === "citizenUser" ||
                            checkAuth() ||
                            !watch("clerkApprovalRemark")
                          }
                          onClick={() => {
                            setBtnSaveText("revert");
                          }}
                          endIcon={<ExitToApp />}
                        >
                          <FormattedLabel id="Revert" />
                        </Button>
                      </Grid>
                    )}

                    {(((statusVal == 14 ||
                      statusVal === 21 ||
                      statusVal === 26) &&
                      authority &&
                      authority.find(
                        (val) => val === commonRoleId.ROLE_CLERK
                      )) ||
                      (statusVal == 5 &&
                        authority &&
                        authority.find(
                          (val) => val === commonRoleId.ROLE_HEAD_CLERK
                        )) ||
                      (statusVal == 7 &&
                        authority &&
                        authority.find(
                          (val) =>
                            val === commonRoleId.ROLE_OFFICE_SUPERINTENDANT
                        )) ||
                      (authority &&
                        authority.find(
                          (val) =>
                            val === commonRoleId.ROLE_ADMINISTRATIVE_OFFICER
                        ) &&
                        statusVal == 9) ||
                      (authority &&
                        authority.find(
                          (val) =>
                            val === commonRoleId.ROLE_ASSISTANT_COMMISHIONER &&
                            statusVal == 11
                        ))) && (
                      <>
                        {" "}
                        <Grid
                          item
                          xl={statusVal === 21 || statusVal === 14 ? 6 : 4}
                          lg={statusVal === 21 || statusVal === 14 ? 6 : 4}
                          md={statusVal === 21 || statusVal === 14 ? 6 : 4}
                          sm={statusVal === 21 || statusVal === 14 ? 6 : 4}
                          xs={12}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "10px",
                          }}
                        >
                          <Button
                            color="success"
                            variant="contained"
                            size="small"
                            type="submit"
                            disabled={!isRemarksFilled}
                            onClick={() => {
                              setBtnSaveText("finalApprove");
                            }}
                            endIcon={<Save />}
                          >
                            <FormattedLabel id="APPROVE" />
                          </Button>
                        </Grid>
                        {/* head clerk */}
                        {statusVal != 21 && statusVal != 14 && (
                          <Grid
                            item
                            xl={4}
                            lg={4}
                            md={4}
                            sm={4}
                            xs={12}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginTop: "10px",
                            }}
                          >
                            <Button
                              color="secondary"
                              variant="contained"
                              size="small"
                              type="submit"
                              disabled={!isRemarksFilled}
                              onClick={() => {
                                setBtnSaveText("revert");
                              }}
                              endIcon={<Save />}
                            >
                              <FormattedLabel id="revert" />
                            </Button>
                          </Grid>
                        )}
                      </>
                    )}

                    {authority &&
                      authority.find(
                        (val) => val === commonRoleId.ROLE_CLERK
                      ) &&
                      statusVal === 16 && (
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
                            size="small"
                            color="success"
                            onClick={() => {
                              setIsModalOpenForResolved(true);
                            }}
                          >
                            <FormattedLabel id="generateLoi" />
                          </Button>
                        </Grid>
                      )}
                  </>
                )}
              </Grid>
            }
            {loggedInUser === "citizenUser" && (
              <Grid container spacing={2} sx={{ padding: "1rem" }}>
                <Grid
                  item
                  xl={statusVal === 13 ? 6 : 12}
                  lg={statusVal === 13 ? 6 : 12}
                  md={statusVal === 13 ? 6 : 12}
                  sm={statusVal === 13 ? 6 : 12}
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
                    size="small"
                    endIcon={<ExitToApp />}
                    onClick={() => {
                      if(loggedInUser==='citizenUser'){
                        router.push("/dashboard");
                      }else if(loggedInUser==='cfcUser'){
                        router.push("/CFC_Dashboard");
                      }else {
                        router.push(
                          `/SlumBillingManagementSystem/transactions/hutTransfer/hutTransferDetails`
                        );
                      }
                    }}
                  >
                    <FormattedLabel id="exit" />
                  </Button>
                </Grid>
                {statusVal === 13 && (
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
                      // marginTop: "20px",
                    }}
                  >
                    <Button
                      color="success"
                      variant="contained"
                      size="small"
                      onClick={() => {
                        router.push({
                          pathname:
                            "/SlumBillingManagementSystem/transactions/acknowledgement/LoiReciptForHutTransfer",
                          query: {
                            id: dataSource?.applicationNo,
                          },
                        });
                      }}
                    >
                      <FormattedLabel id="makeLoiPayment" />
                    </Button>
                  </Grid>
                )}
              </Grid>
            )}
          </form>
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
          padding: "10px",
        }}
      >
        <ThemeProvider theme={theme}>
          <Box
            sx={{
              overflowY: "scroll",
              backgroundColor: "white",
              height: "80vh",
              padding: "10px",
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
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      id="standard-textarea"
                      label={<FormattedLabel id="serviceName" />}
                      multiline
                      variant="standard"
                      value={"Hut Transfer Service charges"}
                    />
                  </Grid>
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
                        watch("currentOwnerFirstName") +
                        " " +
                        watch("currentOwnerMiddleName") +
                        " " +
                        watch("currentOwnerLastName")
                      }
                    />
                  </Grid>
                  {/* mobileNo */}
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      disabled={true}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      label={<FormattedLabel id="mobileNo" />}
                      // @ts-ignore
                      variant="standard"
                      value={watch("currentOwnerMobileNo")}
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
                      // @ts-ignore
                      variant="standard"
                      value={watch("currentOwnerEmailId")}
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
                      // multiline
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
                        variant="contained"
                        color="error"
                        size="small"
                        endIcon={<ClearIcon />}
                        onClick={() => handleCancel()}
                      >
                        <FormattedLabel id="close" />
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
                        onClick={handleLOIButton}
                        variant="contained"
                        color="success"
                        size="small"
                        endIcon={<SaveIcon />}
                      >
                        <FormattedLabel id="generateLoi" />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            </>
          </Box>
        </ThemeProvider>
      </Modal>
    </>
  );
};

export default Index;
