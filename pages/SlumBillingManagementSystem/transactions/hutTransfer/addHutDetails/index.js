import React, { useEffect, useRef, useState } from "react";
import router from "next/router";
import { DataGrid } from "@mui/x-data-grid";
import { DateTimePicker } from "@mui/x-date-pickers";
import {
  Paper,
  Button,
  TextField,
  IconButton,
  Select,
  ThemeProvider,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
  Box,
  Grid,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import theme from "../../../../../theme";
import { Controller, useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import sweetAlert from "sweetalert";
import schema from "../../../../../containers/schema/slumManagementSchema/hutTransferSchema";
import saveAsDraftschema from "../../../../../containers/schema/slumManagementSchema/saveAsDrafthutTransferSchema";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import moment from "moment";
import { useSelector } from "react-redux";
import UploadButton from "../../../../../components/SlumBillingManagementSystem/FileUpload/UploadButton copy";
import { ExitToApp, Save } from "@mui/icons-material";
import axios from "axios";
import urls from "../../../../../URLS/urls";
import { useReactToPrint } from "react-to-print";
import SelfDeclaration from "../generateDocuments/selfDeclaration";
import SelfAttestation from "../generateDocuments/selfAttestation";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import Autocomplete from "@mui/material/Autocomplete";
import Transliteration from "../../../../../components/common/linguosol/transliteration";
import BreadcrumbComponent from "../../../../../components/common/BreadcrumbComponent";
import commonStyles from "../../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../../util/commonErrorUtil";
import {
  EncryptData,
  DecryptData,
} from "../../../../../components/common/EncryptDecrypt";

const Index = () => {
  const [isName, setSaveButtonName] = useState("");
  const [adharData, setAdharData] = useState(false);
  const handleSaveAsDraft = (name) => {
    const a1 = watch("proposedOwnerAadharNo");
    if (!a1) {
      setAdharData(true);
    } else {
      setAdharData(false);
    }

    setSaveButtonName(name);
    setIsDraft(true);
  };
  const methods = useForm({
    criteriaMode: "all",
    resolver:
      isName === "draft" ? yupResolver(saveAsDraftschema) : yupResolver(schema),
    mode: "all",
  });
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    control,
    formState: { errors: error },
  } = methods;
  let loggedInUser = localStorage.getItem("loggedInUser");
  const language = useSelector((state) => state.labels.language);
  const user = useSelector((state) => state.user.user);
  const [photo, setPhoto] = useState(null);
  const [occupierPhoto, setOccupierPhoto] = useState(null);
  const [isSlumTaxes, setIsSlumTaxes] = useState(false);
  const [isOverDuePayment, setIsOverDuePayment] = useState(false);
  const [pendingBillData, setPendingBillData] = useState({});
  const [hutNo, setHutNo] = useState("");
  const [checkAdharNo, setCheckAdharNo] = useState("");
  const [hutOptions, setHutOptions] = useState([]);
  const [choice, setChoice] = useState("");
  const [applicantData, setApplicantData] = useState({});
  const [selectedHutData, setSelectedHutData] = useState(null);
  const [hutOwnerData, setHutOwnerData] = useState({});
  const [openEntryConnections, setOpenEntryConnections] = useState(false);
  const [slumDropDown, setSlumDropDown] = useState([]);
  const [zoneDropDown, setZoneDropDown] = useState([]);
  const [areaDropDown, setAreaDropDown] = useState([]);
  const [villageDropDown, setVillageDropDown] = useState([]);
  const [titleDropDown, setTitleDropDown] = useState([]);
  const [docList, setDocList] = useState([]);
  const [docSaleDeedList, setSaleDeedDocList] = useState([]);
  const [documentList, setDocumentList] = useState([]);
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
  const [transferDropDown, setTransferDropDown] = useState([
    {
      id: 42,
      transferTypeEn: "Sale Deed",
      transferTypeMr: "विक्री करार",
    },
    {
      id: 43,
      transferTypeEn: "Transfer by heredity",
      transferTypeMr: "आनुवंशिकतेनुसार हस्तांतरण",
    },
  ]);
  const [subTransferDropDown, setsubTransferDropDown] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadData, setLoadData] = useState(null);
  const [hutKey, setHutKey] = useState(null);
  const [scheduleList, setScheduleList] = useState([]);
  const [isDraft, setIsDraft] = useState(false);
  const [completeSiteVisitDoc, setCompleteSiteVisitDoc] = useState([]);
  const [manageSiteVisitList, setManageSiteVisitList] = useState([]);
  const [statusVal, setStatusVal] = useState(null);
  const [relationDetails, setRelationDetails] = useState([
    {
      id: 1,
      relation: "",
      relationMr: "",
    },
  ]);
  const [familyMembers, setFamilyMembers] = useState([]);
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

  useEffect(() => {
    if (choice === "selfDeclaration") {
      handleGenerateButton1();
    } else if (choice === "selfAttestation") {
      handleGenerateButton2();
    }
  }, [choice]);

  useEffect(() => {
    if (router.query.id != null && router.query.id != undefined) {
      getHutTransferById();
    }
  }, [router.query.id]);

  const componentRef1 = useRef();
  const handleGenerateButton1 = useReactToPrint({
    content: () => componentRef1.current,
  });

  const componentRef2 = useRef();
  const handleGenerateButton2 = useReactToPrint({
    content: () => componentRef2.current,
  });

  useEffect(() => {
    if (selectedHutData != null) {
      setDataOnUI();
      getAllHutMembers();
    }
  }, [selectedHutData, language]);

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

  const checkAdhar = (value) => {
    if (value != undefined && value) {
      setIsLoading(true);
      const tempData = axios
        .get(
          `${urls.SLUMURL}/mstHutMembers/checkOwnerAlreadyExist?adhaarNo=${value}`,
          {
            headers: headers,
          }
        )
        .then((res) => {
          setIsLoading(false);
          setCheckAdharNo(res.data.status);
          if (res.data.status === "DUPLICATE") {
          }
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  // handle upload attached document if transfer type is "transfer by heridity"

  const handleOnChange = (docId, path) => {
    let temp = [...docList];
    let tempSaleDeed = [...docSaleDeedList];

    let res =
      temp &&
      temp.map((each, i) => {
        if (docId == each.id) {
          return {
            ...each,
            documentPath: path,
            addUpdate: "Add",
          };
        } else {
          return each;
        }
      });

    setDocList(res);

    let res1 =
      tempSaleDeed &&
      tempSaleDeed.map((each, i) => {
        if (docId == each.id) {
          return {
            ...each,
            documentPath: path,
            addUpdate: "Add",
          };
        } else {
          return each;
        }
      });

    setSaleDeedDocList(res1);
  };

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

  const getHutTransferById = () => {
    setIsLoading(true);
    axios
      .get(`${urls.SLUMURL}/trnTransferHut/getById?id=${router.query.id}`, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        setLoadData(res.data);
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  useEffect(() => {
    if (loadData != null) {
      afterLoadData();
    }
  }, [loadData, documentList]);

  const afterLoadData = () => {
    setHutNo(loadData.hutNo);
    setValue("newHutNo", loadData.hutNo);
    setValue("transferTypeKey", loadData.transferTypeKey);
    setValue("transferSubTypeKey", loadData.transferSubTypeKey);
    setValue("transferRemarks", loadData.transferRemarks);
    setValue("saleValue", loadData.saleValue);
    setValue("transferDate", loadData.transferDate);
    setValue("marketValue", loadData.marketValue);
    setValue("areaOfHut", loadData.areaOfHut);
    setValue("proposedOwnerTitle", loadData.proposedOwnerTitle);
    setValue("proposedOwnerFirstName", loadData.proposedOwnerFirstName);
    setValue("proposedOwnerFirstNameMr", loadData.proposedOwnerFirstNameMr);
    setValue("proposedOwnerMiddleName", loadData.proposedOwnerMiddleName);
    setValue("proposedOwnerMiddleNameMr", loadData.proposedOwnerMiddleNameMr);
    setValue("proposedOwnerLastName", loadData.proposedOwnerLastName);
    setValue("proposedOwnerLastNameMr", loadData.proposedOwnerLastNameMr);
    setValue("proposedOwnerMobileNo", loadData.proposedOwnerMobileNo);
    setValue("proposedOwnerAadharNo", loadData.proposedOwnerAadharNo);
    handleUploadDocument(
      loadData?.proposedOwnerPhoto != null ? loadData?.proposedOwnerPhoto : ""
    );
    setManageSiteVisitList(loadData?.trnVisitScheduleList);
    setValue("clerkApprovalRemark", loadData?.clerkApprovalRemark);
    setValue("headClerkApprovalRemark", loadData?.headClerkApprovalRemark);
    setValue(
      "officeSuperintendantApprovalRemark",
      loadData?.officeSuperintendantApprovalRemark
    );
    setValue(
      "administrativeOfficerApprovalRemark",
      loadData?.administrativeOfficerApprovalRemark
    );
    setValue(
      "assistantCommissionerApprovalRemark",
      loadData?.assistantCommissionerApprovalRemark
    );
    setStatusVal(loadData?.status);
    setScheduleList(
      loadData?.trnVisitScheduleList.map((obj, index) => {
        return {
          id: index + 1,
          scheduledTimeText: obj.scheduledTimeText
            ? moment(obj.scheduledTimeText)?.format("DD-MM-YYYY HH:mm ")
            : "-",
        };
      })
    );
    setValue("visitTime", loadData?.trnVisitScheduleList[0]?.visitTime);
    setValue("slongitude", loadData?.trnVisitScheduleList[0]?.longitude);
    setValue("slattitude", loadData?.trnVisitScheduleList[0]?.lattitude);
    setValue("remarks", loadData?.trnVisitScheduleList[0]?.remarks);
    setValue("sgeocode", loadData?.trnVisitScheduleList[0]?.geocode);

    const doc = [];
    // Loop through each attached document and add it to the `doc` array
    for (let i = 1; i <= 6; i++) {
      const attachedDocument =
        loadData?.trnVisitScheduleList[0]?.[`siteImage${i}`];
      if (attachedDocument != null) {
        doc.push({
          id: i,
          filenm: DecryptData("passphraseaaaaaaaaupload",attachedDocument).split("/").pop().split("_").pop(),
          documentPath: attachedDocument,
          documentType: DecryptData("passphraseaaaaaaaaupload",attachedDocument).split(".").pop().toUpperCase(),
        });
      }
      setCompleteSiteVisitDoc(doc);
    }

    // const updatedRecordsWithSerial = docList.map((record, index) => {
    //   const attachedDocumentKey = `attachedDocument${record.id}`;
    //   const attachedDocument = loadData[attachedDocumentKey];

    //   if (attachedDocument) {
    //     return { ...record, documentPath: attachedDocument };
    //   } else {
    //     return record;
    //   }

    if (loadData.transferTypeKey === 43) {
      setDocList(
        loadData.transactionDocumentsList?.map((temp, index) => {
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
            addUpdate: "Update",
            activeFlag: "Y",
          };
        })
      );
    }

    if (loadData.transferTypeKey === 42) {
      setSaleDeedDocList(
        loadData.transactionDocumentsList?.map((temp, index) => {
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
            addUpdate: "Update",
            activeFlag: "Y",
          };
        })
      );
    }

    // const updatedRecordsWithSerialSaleDeed = docSaleDeedList.map(
    //   (record, index) => {
    //     const attachedDocumentKey = `attachedDocument${record.id}`;
    //     const attachedDocument = loadData[attachedDocumentKey];

    //     if (attachedDocument) {
    //       return { ...record, documentPath: attachedDocument };
    //     } else {
    //       return record;
    //     }
    //   }
    // );
    // setSaleDeedDocList(updatedRecordsWithSerialSaleDeed);
  };

  const setDataOnUI = () => {
    let selectedHut = selectedHutData[0];
    let hutOwner =
      selectedHut &&
      selectedHut?.mstHutMembersList.find((obj) => obj.headOfFamily == "Y");
    setHutOwnerData(hutOwner);
    let temp =
      titleDropDown && titleDropDown.find((each) => each.id == hutOwner?.title);

    let temp11 =
      areaDropDown &&
      areaDropDown.find((obj) => obj.id == selectedHut?.areaKey);
    setValue("areaKey", language == "en" ? temp11?.areaEn : temp11?.areaMr);
    setValue(
      "ownerTitle",
      !temp ? "-" : language == "en" ? temp?.title : temp?.titleMr
    );
    setValue(
      "ownerFirstName",
      language == "en" ? hutOwner?.firstName : hutOwner?.firstNameMr
    );
    setValue(
      "ownerMiddleName",
      language == "en" ? hutOwner?.middleName : hutOwner?.middleNameMr
    );
    setValue(
      "ownerLastName",
      language == "en" ? hutOwner?.lastName : hutOwner?.lastNameMr
    );
    setValue("ownerMobileNo", hutOwner?.mobileNo ? hutOwner?.mobileNo : "-");
    setValue("ownerAadharNo", hutOwner?.aadharNo ? hutOwner?.aadharNo : "-");
    setValue("ownerEmailId", hutOwner?.emailId ? hutOwner?.emailId : "-");
    setValue(
      "ocuupiersTitle",
      !selectedHut
        ? "-"
        : language == "en"
        ? selectedHut?.titleEn
        : selectedHut?.titleMr
    );
    setValue(
      "ocuupiersFirstName",
      selectedHut?.firstName ? selectedHut?.firstName : "-"
    );
    setValue(
      "ocuupiersMiddleName",
      selectedHut?.middleName ? selectedHut?.middleName : "-"
    );
    setValue(
      "ocuupiersLastName",
      selectedHut?.lastName ? selectedHut?.lastName : "-"
    );
    setValue(
      "ocuupiersMobileNo",
      selectedHut?.mobileNo ? selectedHut?.mobileNo : "-"
    );
    setValue(
      "ocuupiersAadharNo",
      selectedHut?.aadharNo ? selectedHut?.aadharNo : "-"
    );
    setValue(
      "ocuupiersEmailId",
      selectedHut?.emailId ? selectedHut?.emailId : "-"
    );
    setValue("pincode", selectedHut?.pincode ? selectedHut?.pincode : "-");
    setValue(
      "lattitude",
      selectedHut?.lattitude ? selectedHut?.lattitude : "-"
    );
    setValue(
      "longitude",
      selectedHut?.longitude ? selectedHut?.longitude : "-"
    );
    setValue("oldHutNo", selectedHut?.hutNo ? selectedHut?.hutNo : "-");
    setValue("hutNo", selectedHut?.hutNo ? selectedHut?.hutNo : "");
    let temp_villageKey =
      villageDropDown &&
      villageDropDown.find((obj) => obj.id == selectedHut?.villageKey);
    setValue(
      "villageKey",
      language == "en" ? temp_villageKey?.villageEn : temp_villageKey?.villageMr
    );
  };

  const getAllHutMembers = () => {
    let memberList = selectedHutData[0].mstHutMembersList;
    let _list =
      memberList &&
      memberList.map((each, i) => {
        return {
          id: i + 1,
          fullName: `${each.firstName} ${each.middleName} ${each.lastName}`,
          fullNameMr: `${each.firstNameMr} ${each.middleNameMr} ${each.lastNameMr}`,
          age: each.age,
          relationWithHeadOfFamily:
            relationDetails &&
            relationDetails.find((obj) => obj.id == each.relationKey)?.relation,

          relationWithHeadOfFamilyMr:
            relationDetails &&
            relationDetails.find((obj) => obj.id == each.relationKey)
              ?.relationMr,
        };
      });

    setFamilyMembers(_list);
  };

  useEffect(() => {
    // getSlumData();
    // getZone();
    getAreaData();
    getVillageData();
    getTitleData();
    getHutData();
    getServiceCharges();
    getRelationDetails();
    getTransferTypeDocType();
    setValue("noOfCopies", 1);
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
        cfcErrorCatchMethod(err, true);
      });
  };

  const setDocument = () => {
    setSaleDeedDocList(
      documentList
        ?.filter((obj) => obj.typeOfDocument === 42)
        ?.map((temp, index) => {
          return {
            id: index + 1,
            srNo: index + 1,
            fileName: temp.documentChecklistMr,
            fileNameMr: temp.documentChecklistMr,
            documentPath: "",
            documentKey: temp.id,
            addUpdate: "Add",
            activeFlag: "Y",
          };
        })
    );
    setDocList(
      documentList
        ?.filter((obj) => obj.typeOfDocument === 43)
        ?.map((temp, index) => {
          return {
            id: index + 1,
            srNo: index + 1,
            fileName: temp.documentChecklistMr,
            fileNameMr: temp.documentChecklistMr,
            documentPath: "",
            documentKey: temp.id,
            addUpdate: "Add",
            activeFlag: "Y",
          };
        })
    );
  };

  useEffect(() => {
    if (pendingBillData?.balanceAmount == 0) {
      setIsOverDuePayment(true);
    } else {
      setIsOverDuePayment(false);
    }
  }, [pendingBillData]);

  useEffect(() => {
    if (hutNo != "" && hutNo != null) {
      handleSearchHut();
      getOutstandingTaxes();
    }
  }, [hutNo]);

  const getOutstandingTaxes = () => {
    setIsLoading(true);
    if (hutNo) {
      axios
        .get(
          `${urls.SLUMURL}/trnBill/lastBillAgainstHut/hutNo?hutNo=${hutNo}`,
          {
            headers: headers,
          }
        )
        .then((r) => {
          setIsLoading(false);
          let temp = r.data;
          if (temp?.balanceAmount > 0) {
            setIsSlumTaxes(true);
            setIsOverDuePayment(false);
            setValue("slumTaxesAmount", temp?.balanceAmount);
          }
          setPendingBillData(temp);
        })
        .catch((err) => {
          setIsLoading(false);
          setIsOverDuePayment(true);
        });
    }
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
        setValue("feesApplicable", temp?.amount);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  const handleUploadDocument = (path) => {
    if (path != "") {
      let temp = {
        documentPath: path,
        documentKey: 1,
        documentType: "",
        remark: "",
      };

      setPhoto(temp);
    }
  };

  const getTitleData = () => {
    axios
      .get(`${urls.CFCURL}/master/title/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.title;
        let res =
          result &&
          result.map((r) => {
            return {
              id: r.id,
              title: r.title,
              titleMr: r.titleMr,
            };
          });
        setTitleDropDown(res);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  const getHutData = () => {
    setIsLoading(true);
    axios
      .get(`${urls.SLUMURL}/mstHut/getAll`, {
        headers: headers,
      })
      .then((r) => {
        setIsLoading(false);
        let result = r.data.mstHutList;
        const hutNumbers = result.map((hut) => hut.hutNo);
        setHutOptions(hutNumbers);
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  // handle search connections
  const handleSearchHut = () => {
    setIsLoading(true);

    if (hutNo) {
      axios
        .get(`${urls.SLUMURL}/mstHut/search/hutNo?hutNo=${hutNo}`, {
          headers: headers,
        })
        .then((r) => {
          setIsLoading(false);
          let result = r.data.mstHutList;
          setSelectedHutData(result);
          setHutKey(result[0].id);
          setOpenEntryConnections(true);
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  const getVillageData = () => {
    axios
      .get(`${urls.SLUMURL}/master/village/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.village;
        let res =
          result &&
          result.map((r) => {
            return {
              id: r.id,
              villageEn: r.villageName,
              villageMr: r.villageNameMr,
            };
          });
        setVillageDropDown(res);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // const getSlumData = () => {
  //   axios
  //     .get(`${urls.SLUMURL}/mstSlum/getAll`, {
  //       headers: headers,
  //     })
  //     .then((r) => {
  //       let result = r.data.mstSlumList;
  //       let res =
  //         result &&
  //         result.map((r) => {
  //           return {
  //             id: r.id,
  //             slumEn: r.slumName,
  //             slumMr: r.slumNameMr,
  //           };
  //         });
  //       setSlumDropDown(res);
  //     });
  // };

  const getAreaData = () => {
    axios
      .get(`${urls.CFCURL}/master/area/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.area;
        let res =
          result &&
          result.map((r) => {
            return {
              id: r.id,
              areaEn: r.areaName,
              areaMr: r.areaNameMr,
            };
          });
        setAreaDropDown(res);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  const handleSaveAPI = (formData, isDraftFlag) => {
    let finalDoc = [];
    let dummyDOc =
      watch("transferTypeKey") != 42
        ? docList?.map((obj) => {
            return { ...obj };
          })
        : docSaleDeedList?.map((obj) => {
            return { ...obj };
          });
    if (
      loadData != null &&
      loadData?.transferTypeKey != watch("transferTypeKey")
    ) {
      let deactiveDoc = loadData?.transactionDocumentsList?.map((obj) => {
        return { ...obj, activeFlag: "N" };
      });
      finalDoc.push(
        ...deactiveDoc,
        ...dummyDOc.map((temp) => {
          return { ...temp, id: null };
        })
      );
    } else {
      finalDoc.push(
        ...dummyDOc?.map((obj) => {
          if (!router.query.id) {
            return { ...obj, id: null };
          } else {
            return { ...obj };
          }
        })
      );
    }

    let body = {
      ...loadData,
      slumKey: selectedHutData?.slumKey,
      hutOwnerKey: hutOwnerData?.id,
      hutNo: hutNo,
      saveAsDraft: isDraftFlag,
      currentOwnerTitle: hutOwnerData && hutOwnerData?.title,
      currentOwnerMiddleName: hutOwnerData?.middleName,
      currentOwnerFirstName: hutOwnerData?.firstName,
      currentOwnerLastName: hutOwnerData?.lastName,
      currentOwnerMiddleNameMr: hutOwnerData?.middleNameMr,
      currentOwnerFirstNameMr: hutOwnerData?.firstNameMr,
      currentOwnerLastNameMr: hutOwnerData?.lastNameMr,
      currentOwnerMobileNo: hutOwnerData?.mobileNo,
      currentOwnerAadharNo: hutOwnerData?.aadharNo,
      currentOccupierTitle: formData?.ocuupiersTitle,
      currentOccupierMiddleName: formData?.ocuupiersMiddleName,
      currentOccupierFirstName: formData?.ocuupiersFirstName,
      currentOccupierLastName: formData?.ocuupiersLastName,
      currentOccupierPhoto: occupierPhoto?.documentPath,
      currentOccupierMobileNo: formData?.ocuupiersMobileNo,
      currentOccupierAadharNo: formData?.ocuupiersAadharNo,
      currentOccupierEmailId: formData?.ocuupiersEmailId,
      proposedOwnerTitle: formData?.proposedOwnerTitle,
      proposedOwnerMiddleName: formData?.proposedOwnerMiddleName,
      proposedOwnerFirstName: formData?.proposedOwnerFirstName,
      proposedOwnerLastName: formData?.proposedOwnerLastName,
      proposedOwnerMiddleNameMr: formData?.proposedOwnerMiddleNameMr,
      proposedOwnerFirstNameMr: formData?.proposedOwnerFirstNameMr,
      proposedOwnerLastNameMr: formData?.proposedOwnerLastNameMr,
      proposedOwnerPhoto: photo?.documentPath,
      proposedOwnerMobileNo: formData?.proposedOwnerMobileNo,
      proposedOwnerAadharNo: formData?.proposedOwnerAadharNo,
      proposedOwnerEmailId: formData?.proposedOwnerEmailId,
      outstandingTax: formData?.propertyTaxesAmount,
      transferRemarks: formData?.transferRemarks,
      oldHutNo: hutNo,
      transferDate: formData?.transferDate,
      feesApplicable: watch("feesApplicable"),
      saleValue: formData?.saleValue,
      marketValue: formData?.marketValue,
      areaOfHut: formData?.areaOfHut,
      hutKey: hutKey,
      transferHutMembersList: [],
      transferTypeKey: watch("transferTypeKey"),
      transactionDocumentsList: finalDoc,
    };

    setIsLoading(true);
    const tempData = axios
      .post(`${urls.SLUMURL}/trnTransferHut/save`, body, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        afterSubmitShowAlert(res, body.saveAsDraft);
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  const handleOnSubmit = (formData) => {
    let isDraft = window.event.submitter.name === "draft";
    setIsDraft(isDraft);
    handleSaveAPI(formData, isDraft);
  };

  const afterSubmitShowAlert = (res, isDraft) => {
    if (res.status == 201) {
      isDraft
        ? sweetAlert({
            title: language == "en" ? "Saved!" : "जतन केले",
            text:
              language == "en"
                ? "Hut Transfer Application Saved in draft Successfully !"
                : "झोपडी हस्तांतरण अर्ज मसुद्यात यशस्वीरित्या जतन झाला!",
            icon: "success",
            dangerMode: false,
            closeOnClickOutside: false,
            button: language === "en" ? "Ok" : "ठीक आहे",
          }).then((will) => {
            if (will) {
              if(loggedInUser==='citizenUser'){
                router.push("/dashboard");
              }else if(loggedInUser==='cfcUser'){
                router.push("/CFC_Dashboard");
              }
            }
          })
        : router.query.isDraft === "f"
        ? sweetAlert({
            title: language == "en" ? "Updated!" : "अद्यतनित केले!",
            text:
              language == "en"
                ? "Hut Transfer Application updated successfully !"
                : "झोपडी हस्तांतरण अर्ज यशस्वीरित्या अद्यतनित केला!",
            icon: "success",
            dangerMode: false,
            closeOnClickOutside: false,
            button: language === "en" ? "Ok" : "ठीक आहे",
          }).then((will) => {
            if (will) {
              if(loggedInUser==='citizenUser'){
                router.push("/dashboard");
              }else if(loggedInUser==='cfcUser'){
                router.push("/CFC_Dashboard");
              }
            }
          })
        : sweetAlert({
            title: language == "en" ? "Saved!" : "जतन झाला!",
            text:
              language == "en"
                ? "Hut Transfer Application Saved successfully !"
                : "झोपडी हस्तांतरण अर्ज यशस्वीरित्या जतन झाला!",
            icon: "success",
            dangerMode: false,
            closeOnClickOutside: false,
            button: language === "en" ? "Ok" : "ठीक आहे",
          }).then((will) => {
            if (will) {
              sweetAlert({
                text:
                  language == "en"
                    ? ` Your Hut Transfer Application No Is : ${
                        res.data.message.split("[")[1].split("]")[0]
                      }`
                    : `झोपडी हस्तांतरण अर्जसाठी तुमची विनंती यशस्वीरीत्या पाठवली आहे. तुमचा अर्ज क्र. आहे: ${
                        res.data.message.split("[")[1].split("]")[0]
                      }`,
                icon: "success",
                buttons: [
                  language === "en" ? "View Acknowledgement" : "पावती पहा",
                  language === "en" ? "Go To Dashboard" : "डॅशबोर्डवर जा",
                ],
                dangerMode: false,
                closeOnClickOutside: false,
              }).then((will) => {
                if (will) {
                  {
                    if(loggedInUser==='citizenUser'){
                      router.push("/dashboard");
                    }else if(loggedInUser==='cfcUser'){
                      router.push("/CFC_Dashboard");
                    }
                  }
                } else {
                  router.push({
                    pathname:
                      "/SlumBillingManagementSystem/transactions/acknowledgement/hutTransfer",
                    query: {
                      id: res.data.message.split("[")[1].split("]")[0],
                    },
                  });
                }
              });
            }
          });
    } else {
      sweetAlert(
        language === "en" ? "Error!" : "त्रुटी",
        language === "en" ? "Something Went Wrong !" : '"काहीतरी चूक झाली !"',
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    }
  };

  const handlePaymentButton = () => {
    setIsLoading(true);
    axios
      .get(
        `${urls.SLUMURL}/trnBill/payPendingBills?id=${pendingBillData?.id}`,
        {
          headers: headers,
        }
      )
      .then((r) => {
        setIsLoading(false);
        let temp = r.data;
        setValue("slumTaxesAmount", temp?.balanceAmount);
        if (temp?.balanceAmount == 0) {
          setIsOverDuePayment(true);
          setIsSlumTaxes(false);
          sweetAlert(
            language === "en" ? "Success!" : "यशस्वी !",
            language === "en"
              ? " Payment Done Successfull !"
              : "पेमेंट यशस्वी झाले!",
            "success",
            { button: language === "en" ? "Ok" : "ठीक आहे" }
          );
        } else {
          setIsOverDuePayment(false);
          setIsSlumTaxes(true);
          sweetAlert(
            language === "en" ? "Pending!" : "प्रलंबित!",
            language === "en"
              ? `Still your pending balace is ${temp?.balanceAmount}, Please preceed your payment! `
              : `अजूनही तुमची प्रलंबित शिल्लक  ${temp?.balanceAmount} आहे, कृपया तुमचे पेमेंट अगोदर करा!`,
            "error",
            { button: language === "en" ? "Ok" : "ठीक आहे" }
          );
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

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
      field: language == "en" ? "fileName" : "fileNameMr",
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="fileName" />,
      flex: 1,
    },

    // attchement
    {
      field: "attachedDoc1",
      headerName: <FormattedLabel id="attachment" />,
      width: 200,
      renderCell: (params) => {
        return (
          <Box>
            <UploadButton
              appName="SLUM"
              serviceName="SLUM-Transfer"
              filePath={(path) => {
                handleOnChange(params.row.id, path);
              }}
              fileName={params.row.documentPath}
            />
          </Box>
        );
      },
    },
  ];

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
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleOnSubmit)}>
              <div>
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

                <Grid container spacing={2} sx={{ padding: "1rem" }}>
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Autocomplete
                      value={hutNo}
                      fullWidth
                      onChange={(event, newValue) => {
                        setHutNo(newValue);
                      }}
                      options={hutOptions}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          variant="standard"
                          InputLabelProps={{
                            shrink:
                              watch("hutNo") || !!params.inputProps?.value,
                          }}
                          label={<FormattedLabel id="hutNo" />}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                {openEntryConnections && (
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
                            <FormattedLabel id="hutOwnerDetails" />
                          </h3>
                        </Grid>
                      </Grid>
                    </Box>

                    <Grid container spacing={2} sx={{ padding: "1rem" }}>
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          label={<FormattedLabel id="title" />}
                          variant="standard"
                          {...register("ownerTitle")}
                          InputLabelProps={{
                            shrink: watch("ownerTitle"),
                          }}
                          disabled={true}
                          error={!!error.ownerTitle}
                          helperText={
                            error?.ownerTitle ? error.ownerTitle.message : null
                          }
                        />
                      </Grid>

                      {/* firstName */}
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          label={<FormattedLabel id="firstName" />}
                          variant="standard"
                          {...register("ownerFirstName")}
                          InputLabelProps={{
                            shrink: watch("ownerFirstName"),
                          }}
                          disabled={true}
                          error={!!error.ownerFirstName}
                          helperText={
                            error?.ownerFirstName
                              ? error.ownerFirstName.message
                              : null
                          }
                        />
                      </Grid>

                      {/* middleName */}
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          label={<FormattedLabel id="middleName" />}
                          variant="standard"
                          {...register("ownerMiddleName")}
                          InputLabelProps={{
                            shrink: watch("ownerMiddleName"),
                          }}
                          disabled={true}
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
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          label={<FormattedLabel id="lastName" />}
                          variant="standard"
                          {...register("ownerLastName")}
                          InputLabelProps={{
                            shrink: watch("ownerLastName"),
                          }}
                          disabled={true}
                          error={!!error.ownerLastName}
                          helperText={
                            error?.ownerLastName
                              ? error.ownerLastName.message
                              : null
                          }
                        />
                      </Grid>

                      {/* mobileNo */}
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          label={<FormattedLabel id="mobileNo" />}
                          variant="standard"
                          inputProps={{ maxLength: 10 }}
                          {...register("ownerMobileNo")}
                          InputLabelProps={{
                            shrink: watch("ownerMobileNo"),
                          }}
                          disabled={true}
                          error={!!error.ownerMobileNo}
                          helperText={
                            error?.ownerMobileNo
                              ? error.ownerMobileNo.message
                              : null
                          }
                        />
                      </Grid>

                      {/* aadharNo */}
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          label={<FormattedLabel id="aadharNo" />}
                          variant="standard"
                          {...register("ownerAadharNo")}
                          inputProps={{ maxLength: 12 }}
                          InputLabelProps={{
                            shrink: watch("ownerAadharNo"),
                          }}
                          disabled={true}
                          error={!!error.ownerAadharNo}
                          helperText={
                            error?.ownerAadharNo
                              ? error.ownerAadharNo.message
                              : null
                          }
                        />
                      </Grid>
                    </Grid>

                    {/* Family Member List */}

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
                          label={<FormattedLabel id="area" />}
                          variant="standard"
                          disabled={true}
                          {...register("areaKey")}
                          InputLabelProps={{
                            shrink: watch("areaKey") ? true : false,
                          }}
                          error={!!error.areaKey}
                          helperText={
                            error?.areaKey ? error.areaKey.message : null
                          }
                        />
                      </Grid>

                      {/* Village */}
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          label={<FormattedLabel id="village" />}
                          variant="standard"
                          disabled={true}
                          {...register("villageKey")}
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
                          label={<FormattedLabel id="pincode" />}
                          variant="standard"
                          disabled={true}
                          {...register("pincode")}
                          InputLabelProps={{
                            shrink: watch("pincode") ? true : false,
                          }}
                          error={!!error.pincode}
                          helperText={
                            error?.pincode ? error.pincode.message : null
                          }
                        />
                      </Grid>
                      {/* Lattitude */}
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          label={<FormattedLabel id="lattitude" />}
                          variant="standard"
                          disabled={true}
                          {...register("lattitude")}
                          InputLabelProps={{
                            shrink: watch("lattitude") ? true : false,
                          }}
                          error={!!error.lattitude}
                          helperText={
                            error?.lattitude ? error.lattitude.message : null
                          }
                        />
                      </Grid>

                      {/* Longitude */}
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          label={<FormattedLabel id="longitude" />}
                          variant="standard"
                          disabled={true}
                          {...register("longitude")}
                          InputLabelProps={{
                            shrink: watch("longitude") ? true : false,
                          }}
                          error={!!error.longitude}
                          helperText={
                            error?.longitude ? error.longitude.message : null
                          }
                        />
                      </Grid>
                    </Grid>

                    {/* Outstanding amount */}

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
                            <FormattedLabel id="outstandingTaxesAmount" />
                          </h3>
                        </Grid>
                      </Grid>
                    </Box>
                    <Grid container spacing={2} sx={{ padding: "1rem" }}>
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <TextField
                          disabled={!isSlumTaxes}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          label={<FormattedLabel id="slumTaxesAmount" />}
                          variant="standard"
                          value={watch("slumTaxesAmount")}
                          InputLabelProps={{
                            shrink:
                              watch("slumTaxesAmount") ||
                              watch("slumTaxesAmount") == 0
                                ? true
                                : false,
                          }}
                          error={!!error.slumTaxesAmount}
                          helperText={
                            error?.slumTaxesAmount
                              ? error.slumTaxesAmount.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid
                        item
                        xl={2}
                        lg={2}
                        md={6}
                        sm={6}
                        xs={6}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          variant="contained"
                          size="small"
                          disabled={!isSlumTaxes}
                          onClick={handlePaymentButton}
                        >
                          {language == "en" ? "Payment" : "पेमेंट"}
                        </Button>
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
                      {/* <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          label={<FormattedLabel id="hutNo" />}
                          required={!isDraft}
                          variant="standard"
                          {...register("newHutNo")}
                          InputLabelProps={{
                            shrink: watch("newHutNo") ? true : false,
                          }}
                          error={!!error.newHutNo}
                          helperText={
                            error?.newHutNo ? error.newHutNo.message : null
                          }
                        />
                      </Grid> */}

                      {/* Old Hut No */}
                      {/* <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          label={<FormattedLabel id="oldHutNo" />}
                          variant="standard"
                          {...register("oldHutNo")}
                          InputLabelProps={{
                            shrink: watch("oldHutNo") ? true : false,
                          }}
                          disabled={true}
                          error={!!error.oldHutNo}
                          helperText={
                            error?.oldHutNo ? error.oldHutNo.message : null
                          }
                        />
                      </Grid> */}

                      {/* Transfer Type */}
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <FormControl
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          variant="standard"
                          error={!!error.transferTypeKey}
                          // required={!isDraft}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="transferType" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                  setDocument();
                                }}
                              >
                                {transferDropDown &&
                                  transferDropDown.map((value, index) => (
                                    <MenuItem
                                      sx={{
                                        m: { xs: 0, md: 1 },
                                        minWidth: "100%",
                                      }}
                                      key={index}
                                      value={value.id}
                                    >
                                      {language == "en"
                                        ? value.transferTypeEn
                                        : value?.transferTypeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="transferTypeKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {error?.transferTypeKey
                              ? error.transferTypeKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* sub Transfer Type */}
                      {/* <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <FormControl
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          variant="standard"
                          error={!!error.subTransferTypeKey}
                          // required={!isDraft}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="subTransferType" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                              >
                                {subTransferDropDown &&
                                  subTransferDropDown.map((value, index) => (
                                    <MenuItem key={index} value={value.id}>
                                      {language == "en"
                                        ? value.subTransferTypeEn
                                        : value?.subTransferTypeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="subTransferTypeKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {error?.subTransferTypeKey
                              ? error.subTransferTypeKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid> */}

                      {/* transfer Date */}

                      {/* <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <FormControl
                          error={!!error.transferDate}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        >
                          <Controller
                            control={control}
                            name="transferDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="DD/MM/YYYY"
                                  label={<FormattedLabel id="transferDate" />}
                                  value={field.value}
                                  onChange={(date) => {
                                    field.onChange(
                                      moment(date).format("YYYY-MM-DD")
                                    );
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      required={!isDraft}
                                      {...params}
                                      sx={{
                                        m: { xs: 0, md: 1 },
                                        minWidth: "100%",
                                      }}
                                      variant="standard"
                                      size="small"
                                      error={!!error.transferDate}
                                      helperText={
                                        error?.transferDate
                                          ? error?.transferDate.message
                                          : null
                                      }
                                      InputLabelProps={{
                                        style: {
                                          fontSize: 12,
                                        },
                                      }}
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                        </FormControl>
                      </Grid> */}

                      {/* Sale Value */}
                      {/* <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <TextField
                          required={!isDraft}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          label={<FormattedLabel id="saleValue" />}
                          variant="standard"
                          {...register("saleValue")}
                          InputLabelProps={{
                            shrink: watch("saleValue") ? true : false,
                          }}
                          error={!!error.saleValue}
                          helperText={
                            error?.saleValue ? error.saleValue.message : null
                          }
                        />
                      </Grid> */}

                      {/* Market Value */}
                      {/* <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <TextField
                          required={!isDraft}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          label={<FormattedLabel id="marketValue" />}
                          variant="standard"
                          {...register("marketValue")}
                          InputLabelProps={{
                            shrink: watch("marketValue") ? true : false,
                          }}
                          error={!!error.marketValue}
                          helperText={
                            error?.marketValue
                              ? error.marketValue.message
                              : null
                          }
                        />
                      </Grid> */}

                      {/* Hut Area */}
                      {/* <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <TextField
                          required={!isDraft}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          label={<FormattedLabel id="hutArea" />}
                          variant="standard"
                          {...register("areaOfHut")}
                          InputLabelProps={{
                            shrink: watch("areaOfHut") ? true : false,
                          }}
                          error={!!error.areaOfHut}
                          helperText={
                            error?.areaOfHut ? error.areaOfHut.message : null
                          }
                        />
                      </Grid> */}

                      {/* Transfer Remark */}
                      {/* <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <TextField
                          required={!isDraft}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          label={<FormattedLabel id="transferRemarks" />}
                          variant="standard"
                          {...register("transferRemarks")}
                          InputLabelProps={{
                            shrink: watch("transferRemarks") ? true : false,
                          }}
                          error={!!error.transferRemarks}
                          helperText={
                            error?.transferRemarks
                              ? error.transferRemarks.message
                              : null
                          }
                        />
                      </Grid> */}
                    </Grid>

                    {/* Attach documents if transfer type is "transfer by heridity" */}

                    {watch("transferTypeKey") === 43 ? (
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
                            pageSize={6}
                            rowsPerPageOptions={[6]}
                          />
                        </Grid>
                      </>
                    ) : (
                      <></>
                    )}
                    {watch("transferTypeKey") === 42 ? (
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
                            rows={docSaleDeedList}
                            columns={attachFileColumns}
                            pageSize={6}
                            rowsPerPageOptions={[6]}
                          />
                        </Grid>
                      </>
                    ) : (
                      <></>
                    )}

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
                        <FormControl
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          variant="standard"
                          error={!!error.proposedOwnerTitle}
                          required={!isDraft}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="proposedOwnerTitle" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                              >
                                {titleDropDown &&
                                  titleDropDown.map((value, index) => (
                                    <MenuItem key={index} value={value.id}>
                                      {language == "en"
                                        ? value.title
                                        : value?.titleMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="proposedOwnerTitle"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {error?.proposedOwnerTitle
                              ? error.proposedOwnerTitle.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <>
                        {/* proposed Owner firstName */}
                        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                          <Transliteration
                            variant={"standard"}
                            _key={"proposedOwnerFirstName"}
                            labelName={"proposedOwnerFirstName"}
                            fieldName={"proposedOwnerFirstName"}
                            updateFieldName={"proposedOwnerFirstNameMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            label={
                              <FormattedLabel
                                id="proposedOwnerFirstName"
                                required
                              />
                            }
                            error={!!error.proposedOwnerFirstName}
                            helperText={
                              error?.proposedOwnerFirstName
                                ? error.proposedOwnerFirstName.message
                                : null
                            }
                          />
                        </Grid>

                        {/*proposed Owner middleName */}
                        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                          <Transliteration
                            variant={"standard"}
                            _key={"proposedOwnerMiddleName"}
                            labelName={"proposedOwnerMiddleName"}
                            fieldName={"proposedOwnerMiddleName"}
                            updateFieldName={"proposedOwnerMiddleNameMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            label={
                              <FormattedLabel
                                id="proposedOwnerMiddleName"
                                required
                              />
                            }
                            error={!!error.proposedOwnerMiddleName}
                            helperText={
                              error?.proposedOwnerMiddleName
                                ? error.proposedOwnerMiddleName.message
                                : null
                            }
                          />
                        </Grid>
                        {/* proposed Owner lastName */}
                        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                          <Transliteration
                            variant={"standard"}
                            _key={"proposedOwnerLastName"}
                            labelName={"proposedOwnerLastName"}
                            fieldName={"proposedOwnerLastName"}
                            updateFieldName={"proposedOwnerLastNameMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            label={
                              <FormattedLabel
                                id="proposedOwnerLastName"
                                required
                              />
                            }
                            error={!!error.proposedOwnerLastName}
                            helperText={
                              error?.proposedOwnerLastName
                                ? error.proposedOwnerLastName.message
                                : null
                            }
                          />
                        </Grid>

                        {/* proposed Owner firstName mr*/}
                        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                          <Transliteration
                            variant={"standard"}
                            _key={"proposedOwnerFirstNameMr"}
                            labelName={"proposedOwnerFirstNameMr"}
                            fieldName={"proposedOwnerFirstNameMr"}
                            updateFieldName={"proposedOwnerFirstName"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            label={
                              <FormattedLabel
                                id="proposedOwnerFirstNameMr"
                                required
                              />
                            }
                            error={!!error.proposedOwnerFirstNameMr}
                            helperText={
                              error?.proposedOwnerFirstNameMr
                                ? error.proposedOwnerFirstNameMr.message
                                : null
                            }
                          />
                        </Grid>

                        {/*proposed Owner middleName mr*/}
                        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                          <Transliteration
                            variant={"standard"}
                            _key={"proposedOwnerMiddleNameMr"}
                            labelName={"proposedOwnerMiddleNameMr"}
                            fieldName={"proposedOwnerMiddleNameMr"}
                            updateFieldName={"proposedOwnerMiddleName"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            label={
                              <FormattedLabel
                                id="proposedOwnerMiddleNameMr"
                                required
                              />
                            }
                            error={!!error.proposedOwnerMiddleNameMr}
                            helperText={
                              error?.proposedOwnerMiddleNameMr
                                ? error.proposedOwnerMiddleNameMr.message
                                : null
                            }
                          />
                        </Grid>
                        {/* proposed Owner lastName mr*/}
                        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                          <Transliteration
                            variant={"standard"}
                            _key={"proposedOwnerLastNameMr"}
                            labelName={"proposedOwnerLastNameMr"}
                            fieldName={"proposedOwnerLastNameMr"}
                            updateFieldName={"proposedOwnerLastName"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            label={
                              <FormattedLabel
                                id="proposedOwnerLastNameMr"
                                required
                              />
                            }
                            error={!!error.proposedOwnerLastNameMr}
                            helperText={
                              error?.proposedOwnerLastNameMr
                                ? error.proposedOwnerLastNameMr.message
                                : null
                            }
                          />
                        </Grid>
                      </>

                      {/* proposed Owner mobileNo */}
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <TextField
                          required={!isDraft}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          label={<FormattedLabel id="proposedOwnerMobileNo" />}
                          variant="standard"
                          {...register("proposedOwnerMobileNo")}
                          InputLabelProps={{
                            shrink: watch("proposedOwnerMobileNo")
                              ? true
                              : false,
                          }}
                          inputProps={{ maxLength: 10 }}
                          error={!!error.proposedOwnerMobileNo}
                          helperText={
                            error?.proposedOwnerMobileNo
                              ? error.proposedOwnerMobileNo.message
                              : null
                          }
                        />
                      </Grid>

                      {/* proposed Owner aadharNo */}
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        {/* <TextField
                          required={!isDraft}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          label={<FormattedLabel id="proposedOwnerAadharNo" />}
                          variant="standard"
                          {...register("proposedOwnerAadharNo")}
                          InputLabelProps={{
                            shrink: watch("proposedOwnerAadharNo")
                              ? true
                              : false,
                          }}
                          inputProps={{ maxLength: 12 }}
                          error={!!error.proposedOwnerAadharNo}
                          helperText={
                            error?.proposedOwnerAadharNo
                              ? error.proposedOwnerAadharNo.message
                              : null
                          }
                        /> */}
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          required={!isDraft}
                          onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                          inputProps={{ maxLength: 12, minLength: 12 }}
                          onInput={(e) => {
                            if (e.target.value.length === 12) {
                              checkAdhar(e.target.value);
                            }
                          }}
                          label={<FormattedLabel id="proposedOwnerAadharNo" />}
                          size="small"
                          {...register(`proposedOwnerAadharNo`)}
                          // error={
                          //   checkAdharNo === "DUPLICATE" || adharData == true
                          // }
                          // InputProps={{
                          //   style: {
                          //     borderColor:
                          //       checkAdharNo === "DUPLICATE" &&
                          //       // !watch("proposedOwnerAadharNo")
                          //       adharData == true
                          //         ? "red"
                          //         : "inherit",
                          //   },
                          // }}
                          // helperText={
                          //   // !watch("proposedOwnerAadharNo")
                          //   adharData == true
                          //     ? language === "en"
                          //       ? "Adhar no is required"
                          //       : "आधार क्र. आवश्यक आहे"
                          //     : checkAdharNo === "DUPLICATE" && (
                          //         <span style={{ color: "red" }}>
                          //           <FormattedLabel id="aadharErrorMsg" />
                          //         </span>
                          //       )
                          // }
                          error={
                            isName == "save" &&
                            (checkAdharNo === "DUPLICATE" || adharData)
                          }
                          InputProps={{
                            style: {
                              borderColor:
                                isName == "draft"
                                  ? "inherit"
                                  : checkAdharNo === "DUPLICATE" || adharData
                                  ? "red"
                                  : "inherit",
                            },
                          }}
                          helperText={
                            isName == "save"
                              ? adharData == true
                                ? language === "en"
                                  ? "Adhar no is required"
                                  : "आधार क्र. आवश्यक आहे"
                                : checkAdharNo === "DUPLICATE" && (
                                    <span style={{ color: "red" }}>
                                      <FormattedLabel id="aadharErrorMsg" />
                                    </span>
                                  )
                              : null // Hide error message when isDraft is true
                          }
                        />
                      </Grid>

                      {/*  proposed Owner Upload Photos */}
                      <Grid
                        item
                        xl={6}
                        lg={6}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "20px",
                        }}
                      >
                        <label>
                          <b>
                            <FormattedLabel id="husbandWifePhoto" required /> :
                          </b>
                        </label>
                        <UploadButton
                          appName="SLUM"
                          serviceName="SLUM-Transfer"
                          filePath={(path) => {
                            handleUploadDocument(path);
                          }}
                          fileName={photo && photo.documentPath}
                        />
                      </Grid>
                    </Grid>

                    {router.query.isDraft != undefined && (
                      <>
                        {statusVal === 23 && (
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
                                    <FormattedLabel id="scheduleSiteVisit" />
                                  </h3>
                                </Grid>
                              </Grid>
                            </Box>
                            {scheduleList.length != 0 && (
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
                                pagination={{
                                  pageSizeOptions: [10, 20, 50, 100],
                                }}
                                rows={scheduleList}
                                columns={columns}
                              />
                            )}
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
                            <Grid
                              container
                              spacing={2}
                              sx={{ padding: "1rem" }}
                            >
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
                                        value={field.value}
                                        onChange={(date) =>
                                          field.onChange(
                                            moment(date).format(
                                              "YYYY-MM-DDThh:mm:ss"
                                            )
                                          )
                                        }
                                        defaultValue={null}
                                        disabled
                                        inputFormat="DD-MM-YYYY hh:mm:ss"
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
                                        disabled={true}
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
                                        value={field.value}
                                        onChange={(date) =>
                                          field.onChange(
                                            moment(date).format(
                                              "YYYY-MM-DDThh:mm:ss"
                                            )
                                          )
                                        }
                                        defaultValue={null}
                                        inputFormat="DD-MM-YYYY hh:mm:ss"
                                      />
                                    </LocalizationProvider>
                                  )}
                                />
                              </Grid>
                              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                                <TextField
                                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                  label={
                                    <FormattedLabel id="lattitude" required />
                                  }
                                  variant="standard"
                                  disabled={true}
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
                                  label={
                                    <FormattedLabel id="longitude" required />
                                  }
                                  variant="standard"
                                  disabled={true}
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
                                  label={
                                    <FormattedLabel id="geocode" required />
                                  }
                                  variant="standard"
                                  disabled={true}
                                  {...register("sgeocode")}
                                  InputLabelProps={{
                                    shrink: watch("sgeocode") ? true : false,
                                  }}
                                  error={!!error.sgeocode}
                                  helperText={
                                    error?.sgeocode
                                      ? error.sgeocode.message
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
                            {
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
                            }
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
                                    <FormattedLabel id="generateReports" />
                                  </h3>
                                </Grid>
                              </Grid>
                            </Box>
                            <Grid
                              container
                              spacing={2}
                              sx={{ padding: "1rem" }}
                            >
                              {/* Generate Inspection Report */}
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
                              </Grid>

                              <Grid
                                container
                                spacing={2}
                                sx={{ padding: "1rem" }}
                              >
                                <Grid
                                  item
                                  xl={12}
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  xs={12}
                                >
                                  <TextField
                                    sx={{
                                      m: { xs: 0, md: 1 },
                                      minWidth: "100%",
                                    }}
                                    label={<FormattedLabel id="remarks" />}
                                    variant="standard"
                                    disabled={true}
                                    multiline
                                    {...register("remarks")}
                                    InputLabelProps={{
                                      shrink: watch("remarks") ? true : false,
                                    }}
                                    error={!!error.remarks}
                                    helperText={
                                      error?.remarks
                                        ? error.remarks.message
                                        : null
                                    }
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                          </>
                        )}
                        <>
                          {(statusVal === 1 || statusVal == 23) && (
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
                              <Grid
                                container
                                spacing={2}
                                sx={{ padding: "1rem" }}
                              >
                                {watch("clerkApprovalRemark") && (
                                  <Grid
                                    item
                                    xl={12}
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                  >
                                    <TextField
                                      sx={{
                                        m: { xs: 0, md: 1 },
                                        minWidth: "100%",
                                      }}
                                      label={
                                        <FormattedLabel id="clearkRemarks" />
                                      }
                                      variant="standard"
                                      disabled={true}
                                      multiline
                                      {...register("clerkApprovalRemark")}
                                      InputLabelProps={{
                                        shrink: watch("clerkApprovalRemark")
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
                                )}

                                {watch("headClerkApprovalRemark") && (
                                  <Grid
                                    item
                                    xl={12}
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                  >
                                    <TextField
                                      sx={{
                                        m: { xs: 0, md: 1 },
                                        minWidth: "100%",
                                      }}
                                      label={
                                        <FormattedLabel id="headClerkApprovalRemark" />
                                      }
                                      variant="standard"
                                      multiline
                                      disabled={true}
                                      {...register("headClerkApprovalRemark")}
                                      InputLabelProps={{
                                        shrink: watch("headClerkApprovalRemark")
                                          ? true
                                          : false,
                                      }}
                                      error={!!error.headClerkApprovalRemark}
                                      helperText={
                                        error?.headClerkApprovalRemark
                                          ? error.headClerkApprovalRemark
                                              .message
                                          : null
                                      }
                                    />
                                  </Grid>
                                )}

                                {watch(
                                  "officeSuperintendantApprovalRemark"
                                ) && (
                                  <Grid
                                    item
                                    xl={12}
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                  >
                                    <TextField
                                      sx={{
                                        m: { xs: 0, md: 1 },
                                        minWidth: "100%",
                                      }}
                                      label={
                                        <FormattedLabel id="officeSuperintendantApprovalRemark" />
                                      }
                                      variant="standard"
                                      disabled={true}
                                      {...register(
                                        "officeSuperintendantApprovalRemark"
                                      )}
                                      InputLabelProps={{
                                        shrink: watch(
                                          "officeSuperintendantApprovalRemark"
                                        )
                                          ? true
                                          : false,
                                      }}
                                      error={
                                        !!error.officeSuperintendantApprovalRemark
                                      }
                                      helperText={
                                        error?.officeSuperintendantApprovalRemark
                                          ? error
                                              .officeSuperintendantApprovalRemark
                                              .message
                                          : null
                                      }
                                    />
                                  </Grid>
                                )}

                                {watch(
                                  "administrativeOfficerApprovalRemark"
                                ) && (
                                  <Grid
                                    item
                                    xl={12}
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                  >
                                    <TextField
                                      sx={{
                                        m: { xs: 0, md: 1 },
                                        minWidth: "100%",
                                      }}
                                      label={
                                        <FormattedLabel id="administrativeOfficerApprovalRemark" />
                                      }
                                      variant="standard"
                                      disabled={true}
                                      {...register(
                                        "administrativeOfficerApprovalRemark"
                                      )}
                                      InputLabelProps={{
                                        shrink: watch(
                                          "administrativeOfficerApprovalRemark"
                                        )
                                          ? true
                                          : false,
                                      }}
                                      error={
                                        !!error.administrativeOfficerApprovalRemark
                                      }
                                      helperText={
                                        error?.administrativeOfficerApprovalRemark
                                          ? error
                                              .administrativeOfficerApprovalRemark
                                              .message
                                          : null
                                      }
                                    />
                                  </Grid>
                                )}

                                {watch(
                                  "assistantCommissionerApprovalRemark"
                                ) && (
                                  <Grid
                                    item
                                    xl={12}
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                  >
                                    <TextField
                                      sx={{
                                        m: { xs: 0, md: 1 },
                                        minWidth: "100%",
                                      }}
                                      label={
                                        <FormattedLabel id="assistantCommissionerApprovalRemark" />
                                      }
                                      variant="standard"
                                      disabled={true}
                                      {...register(
                                        "assistantCommissionerApprovalRemark"
                                      )}
                                      InputLabelProps={{
                                        shrink: watch(
                                          "assistantCommissionerApprovalRemark"
                                        )
                                          ? true
                                          : false,
                                      }}
                                      error={
                                        !!error.assistantCommissionerApprovalRemark
                                      }
                                      helperText={
                                        error?.assistantCommissionerApprovalRemark
                                          ? error
                                              .assistantCommissionerApprovalRemark
                                              .message
                                          : null
                                      }
                                    />
                                  </Grid>
                                )}

                                {watch("finalApprovedRemark") && (
                                  <Grid
                                    item
                                    xl={12}
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                  >
                                    <TextField
                                      sx={{
                                        m: { xs: 0, md: 1 },
                                        minWidth: "100%",
                                      }}
                                      label={
                                        <FormattedLabel id="finalApprovedRemark" />
                                      }
                                      variant="standard"
                                      disabled={true}
                                      {...register("finalApprovedRemark")}
                                      InputLabelProps={{
                                        shrink: watch("finalApprovedRemark")
                                          ? true
                                          : false,
                                      }}
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
                      </>
                    )}

                    <Grid container spacing={2} sx={{ padding: "1rem" }}>
                      <Grid
                        item
                        xl={router.query.isDraft == undefined ? 4 : 6}
                        lg={router.query.isDraft == undefined ? 4 : 6}
                        md={router.query.isDraft == undefined ? 4 : 6}
                        sm={12}
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
                          endIcon={<ExitToApp />}
                          size="small"
                          onClick={() => {
                            if(loggedInUser==='citizenUser'){
                              router.push("/dashboard");
                            }else if(loggedInUser==='cfcUser'){
                              router.push("/CFC_Dashboard");
                            }
                          }}
                        >
                          <FormattedLabel id="exit" />
                          {/* {labels["exit"]} */}
                        </Button>
                      </Grid>
                      {router.query.isDraft == undefined && (
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={4}
                          sm={12}
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
                            color="primary"
                            size="small"
                            type="submit"
                            name="draft"
                            // disabled={
                            //   watch("proposedOwnerAadharNo")
                            //   &&
                            //   checkAdharNo === "DUPLICATE"
                            // }
                            onClick={() => handleSaveAsDraft("draft")}
                            endIcon={<Save />}
                          >
                            <FormattedLabel id="saveAsDraft" />
                          </Button>
                        </Grid>
                      )}
                      <Grid
                        item
                        xl={router.query.isDraft == undefined ? 4 : 6}
                        lg={router.query.isDraft == undefined ? 4 : 6}
                        md={router.query.isDraft == undefined ? 4 : 6}
                        sm={12}
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
                          type="submit"
                          size="small"
                          disabled={
                            isSlumTaxes ||
                            !photo ||
                            !photo.documentPath 
                          }
                          onClick={() => handleSaveAsDraft("save")}
                          endIcon={<Save />}
                        >
                          {router.query.isDraft === "f" ? (
                            <FormattedLabel id="update" />
                          ) : (
                            <FormattedLabel id="save" />
                          )}
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                )}

                {/* Buttons Row */}

                <Paper style={{ display: "none" }}>
                  {choice &&
                    choice === "selfDeclaration" &&
                    selectedHutData && (
                      <SelfDeclaration
                        applicantData={applicantData}
                        hutData={selectedHutData}
                        componentRef={componentRef1}
                      />
                    )}
                  {choice &&
                    choice === "selfAttestation" &&
                    selectedHutData && (
                      <SelfAttestation
                        applicantData={applicantData}
                        hutData={selectedHutData}
                        componentRef={componentRef2}
                      />
                    )}
                </Paper>
              </div>
            </form>
          </FormProvider>
        </Paper>
      </ThemeProvider>
    </>
  );
};

export default Index;
