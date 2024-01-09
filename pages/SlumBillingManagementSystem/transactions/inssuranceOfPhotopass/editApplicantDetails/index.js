import React, { useEffect, useRef, useState } from "react";
import router from "next/router";
import { DataGrid } from "@mui/x-data-grid";
import theme from "../../../../../theme";
import {
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
  Box,
  Grid,
  ThemeProvider,
  Modal,
  IconButton,
  Autocomplete,
  keyframes,
} from "@mui/material";
import { Controller, useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import sweetAlert from "sweetalert";
import schema from "../../../../../containers/schema/slumManagementSchema/insuranceOfPhotopassSchema";
import saveAsDraftSchemaPhotoPass from "../../../../../containers/schema/slumManagementSchema/saveAsDraftInsuranceOfPhotopassSchema";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import UploadButton from "../../../../../components/SlumBillingManagementSystem/FileUpload/UploadButton copy";
import { ExitToApp, Save } from "@mui/icons-material";
import axios from "axios";
import urls from "../../../../../URLS/urls";
import { useReactToPrint } from "react-to-print";
import SelfDeclaration from "../generateDocuments/selfDeclaration";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SelfAttestation from "../generateDocuments/selfAttestation";
import ClearIcon from "@mui/icons-material/Clear";
import Loader from "../../../../../containers/Layout/components/Loader";
import Transliteration from "../../../../../components/common/linguosol/transliteration";
import BreadcrumbComponent from "../../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";
import commonStyles from "../../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../../util/commonErrorUtil";

const Index = () => {
  const [isName, setSaveButtonName] = useState("");
  const handleSaveAsDraft = (name) => {
    setSaveButtonName(name);
    setIsDraft(true);
  };
  const methods = useForm({
    criteriaMode: "all",
    resolver:
      isName === "draft"
        ? yupResolver(saveAsDraftSchemaPhotoPass)
        : yupResolver(schema),
    mode: "all",
  });
  const {
    register,
    reset,
    watch,
    setValue,
    handleSubmit,
    control,
    formState: { errors: error },
  } = methods;

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

  // Define the blinking animation using keyframes
  const blinkAnimation = keyframes`
0%, 50% {
  opacity: 0.7; /* Visible */
}
50% {
  opacity: 0.3; /* Invisible */
}
`;

  const language = useSelector((state) => state.labels.language);
  const user = useSelector((state) => state.user.user);
  const [photoPassDetails, setPhotopassDetails] = useState(null);
  let loggedInUser = localStorage.getItem("loggedInUser");
  const [photo, setPhoto] = useState();
  const [photo1, setPhoto1] = useState();
  const [photo2, setPhoto2] = useState();
  const [isSlumTaxes, setIsSlumTaxes] = useState(false);
  const [isOverDuePayment, setIsOverDuePayment] = useState(false);
  const [pendingBillData, setPendingBillData] = useState({});
  const [hutKey, setHutKey] = useState("");
  const [choice, setChoice] = useState("");
  const [applicantData, setApplicantData] = useState({});
  const [selectedHutData, setSelectedHutData] = useState({});
  const [hutOwnerData, setHutOwnerData] = useState({});
  const [spouseDetails, setSpouseDetails] = useState({});
  const [openEntryConnections, setOpenEntryConnections] = React.useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [docList, setDocList] = useState([]);
  const [requiredUploadDoc, setRequiredUploadDoc] = useState(null);
  const [requiredUploadDoc1, setRequiredUploadDoc1] = useState(null);

  const [selfDeclarationFlag, setSelfDeclarationFlag] = useState(false);
  const [selfAttestationFlag, setSelfAttestationFlag] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCancel = () => setIsModalOpenForResolved(false);
  const [isModalOpenForResolved, setIsModalOpenForResolved] = useState(false);
  const headers = { Authorization: `Bearer ${user?.token}` };
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error, moduleOrCFC) => {
    console.log('error', error)
    
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
  const [relationDetails, setRelationDetails] = useState([
    {
      id: 1,
      relation: "",
      relationMr: "",
    },
  ]);
  const [titleDropDown, setTitleDropDown] = useState([
    {
      id: 1,
      titleEn: "",
      titleMr: "",
    },
  ]);

  const [slumDropDown, setSlumDropDown] = useState([]);
  const [areaDropDown, setAreaDropDown] = useState([]);
  const [villageDropDown, setVillageDropDown] = useState([]);

  const [hutDataList, setHutDataList] = useState([]);
  const [hutNoValue, setHutNoValue] = useState(null);

  useEffect(() => {
    if (choice === "selfDeclaration") {
      handleGenerateButton1();
    } else if (choice === "selfAttestation") {
      handleGenerateButton2();
    }
  }, [choice]);

  const componentRef1 = useRef();
  const handleGenerateButton1 = useReactToPrint({
    content: () => componentRef1.current,
  });

  const componentRef2 = useRef();
  const handleGenerateButton2 = useReactToPrint({
    content: () => componentRef2.current,
  });

  useEffect(() => {
    if (router.query.id != null && router.query.id != undefined) {
      getIssuranceOfPhotoPassById();
    }
  }, [router.query.id]);

  const getIssuranceOfPhotoPassById = () => {
    setIsLoading(true);
    axios
      .get(`${urls.SLUMURL}/trnIssuePhotopass/getById?id=${router.query.id}`, {
        headers: headers,
      })
      .then((r) => {
        setIsLoading(false);
        let temp = r.data;
        console.log("fetchDataOnUI", r.data);
        setPhotopassDetails(r.data);
        fetchDataOnUI(r.data);
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  const fetchDataOnUI = (data) => {
    console.log("data", data);
    setHutKey(data.hutKey);
    // getOutstandingTaxes(data?.hutNo);
    handleUploadDocument1(
      data.transactionDocumentsList.find((obj) => obj.documentKey === 121)
        ?.documentPath,
      true,
      data.transactionDocumentsList.find((obj) => obj.documentKey === 121)?.id
    );
    handleUploadDocument2(
      data.transactionDocumentsList.find((obj) => obj.documentKey === 122)
        ?.documentPath,
      true,
      data.transactionDocumentsList.find((obj) => obj.documentKey === 122)?.id
    );

    setValue("ownerFirstName", data.applicantFirstName);
    setValue("clerkApprovalRemark", data?.clerkApprovalRemark);
    setValue("ownerMiddleName", data.applicantMiddleName);
    setValue("ownerTitle", data.applicantTitle);
    setValue("ownerFirstNameMr", data.applicantFirstNameMr);
    setValue("ownerMiddleNameMr", data.applicantMiddleNameMr);
    setValue("ownerLastName", data.applicantLastName);
    setValue("ownerLastNameMr", data.applicantLastNameMr);
    setValue("ownerMobileNo", data.applicantMobileNo);
    setValue("ownerAadharNo", data.applicantAadharNo);
    setValue("ownerAge", data.applicantAge);
    setValue(
      "ownerEmail",
      data.applicantEmailId === null ? "-" : data.applicantEmailId
    );
    setValue(
      "ownerOccupation",
      data.applicantOccupation === null ? "-" : data.applicantOccupation
    );
    setValue(
      "ownerRelation",
      data.applicantRelationKey === null ? "-" : data.applicantRelationKey
    );
    handleUploadDocument(data.husbandWifeCombinedPhoto);

    setValue("spouseTitle", data?.coApplicantTitle);
    setValue("spouseFirstName", data?.coApplicantFirstName);
    setValue("spouseMiddleName", data?.coApplicantMiddleName);
    setValue("spouseLastName", data?.coApplicantLastName);
    setValue("spouseFirstNameMr", data?.coApplicantFirstNameMr);
    setValue("spouseMiddleNameMr", data?.coApplicantMiddleNameMr);
    setValue("spouseLastNameMr", data?.coApplicantLastNameMr);
    const extractedData = data?.transactionDocumentsList.map(
      ({ id, documentKey, documentType, documentPath, remark }) => ({
        id,
        documentKey,
        documentType,
        documentPath,
        remark,
      })
    );
    console.log("temp", extractedData);
    setRequiredUploadDoc1(extractedData);
    // setValue(
    //   "spouseFirstName",
    //   !data?.coApplicantFirstName
    //     ? ""
    //     : language == "en"
    //     ? data?.coApplicantFirstName
    //     : data?.coApplicantFirstNameMr
    // );
    // setValue(
    //   "spouseMiddleName",
    //   !data?.coApplicantMiddleName
    //     ? ""
    //     : language == "en"
    //     ? data?.coApplicantMiddleName
    //     : data?.coApplicantMiddleNameMr
    // );
    // setValue(
    //   "spouseLastName",
    //   !data?.coApplicantLastName
    //     ? ""
    //     : language == "en"
    //     ? data?.coApplicantLastName
    //     : data?.coApplicantLastNameMr
    // );
    setValue("spouseMobileNo", data?.coApplicantMobileNo);
    setValue("spouseAadharNo", data?.coApplicantAadharNo);
    setValue("spouseEmail", data?.coApplicantEmail);
    setValue("spouseAge", data?.coApplicantAge);
    setValue("spouseOccupation", data?.coApplicantOccupation);
    setValue("spouseRelationKey", data?.coApplicantRelationKey);
  };

  const handleOnChange = (docId, path, typeOfDocument) => {
    let temp = [...docList];
    console.log("temp", temp);
    let res =
      temp &&
      temp.map((each, i) => {
        if (docId == each.id) {
          return {
            ...each,
            // id: docId,
            documentPath: path,
            // remark: null,
            // documentKey: each.id,
            // documentType: typeOfDocument,
          };
        } else {
          return each;
        }
      });
    console.log("temp__", res);

    setDocList(res);
  };

  useEffect(() => {
    if (hutKey != "" && hutKey != undefined) {
      getHutOwnerDetailsByHutKey();
    }
  }, [hutKey]);

  const getHutOwnerDetailsByHutKey = () => {
    axios
      .get(`${urls.SLUMURL}/mstHut/getById?id=${hutKey}`, {
        headers: headers,
      })
      .then((r) => {
        setValue("pincode", r.data.pincode);
        setHutNoValue(r.data.hutNo);
        setValue("hutNo", r.data.hutNo);
        setValue(
          "slumKey", r.data.slumKey
        );
        console.log('r.data.slumKey', r.data.slumKey)

        setValue("lattitude", r.data?.lattitude ? r.data?.lattitude : "-");
        setValue("longitude", r.data?.longitude ? r.data?.longitude : "-");
        setValue(
          "villageKey", r.data?.villageKey
        );
        setValue(
          "areaKey", r.data?.areaKey)
        let hutOwner =
          r.data &&
          r.data.mstHutMembersList.find((obj) => obj.headOfFamily === "Y");
        setValue(
          "ownerTitle",
          !hutOwner?.title
            ? "-"
            : language == "en"
            ? titleDropDown &&
              titleDropDown.find((obj) => obj.id == hutOwner?.title)?.titleEn
            : titleDropDown &&
              titleDropDown.find((obj) => obj.id == hutOwner?.title)?.titleMr
        );
        // setValue(
        //   "ownerFirstName",
        //   language == "en" ? hutOwner?.firstName : hutOwner?.firstNameMr
        // );
        setValue("ownerMiddleName", hutOwner?.middleName);
        setValue("ownerMiddleNameMr", hutOwner?.middleNameMr);
        setValue("ownerLastName", hutOwner?.lastName);
        setValue("ownerLastNameMr", hutOwner?.lastNameMr);
        setValue(
          "ownerMobileNo",
          hutOwner?.mobileNo ? hutOwner?.mobileNo : "-"
        );
        setValue(
          "ownerAadharNo",
          hutOwner?.aadharNo ? hutOwner?.aadharNo : "-"
        );
        setValue("ownerEmailId", hutOwner?.emailId ? hutOwner?.emailId : "-");
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  useEffect(() => {
    if (selectedHutData != null) {
      setDataOnUI();
    }
  }, [selectedHutData, hutOwnerData, spouseDetails, language]);

  const setDataOnUI = () => {
    let selectedHut = selectedHutData[0];
    let hutOwner = hutOwnerData;
    let spouseData = spouseDetails;
    setHutKey(selectedHut?.id);
    setValue(
      "ownerTitle",
      !hutOwner?.title
        ? "-"
        : language == "en"
        ? titleDropDown &&
          titleDropDown.find((obj) => obj.id == hutOwner?.title)?.titleEn
        : titleDropDown &&
          titleDropDown.find((obj) => obj.id == hutOwner?.title)?.titleMr
    );
    setValue(
      "ownerFirstName",
      !hutOwner?.firstName ? "-" : hutOwner?.firstName
    );
    setValue(
      "ownerMiddleName",
      !hutOwner?.middleName ? "-" : hutOwner?.middleName
    );
    setValue("ownerLastName", !hutOwner?.lastName ? "-" : hutOwner?.lastName);
    setValue(
      "ownerFirstNameMr",
      !hutOwner?.firstNameMr ? "-" : hutOwner?.firstNameMr
    );
    setValue(
      "ownerMiddleNameMr",
      !hutOwner?.middleNameMr ? "-" : hutOwner?.middleNameMr
    );
    setValue(
      "ownerLastNameMr",
      !hutOwner?.lastName ? "-" : hutOwner?.lastNameMr
    );
    setValue("ownerMobileNo", hutOwner?.mobileNo ? hutOwner?.mobileNo : "-");
    setValue("ownerAadharNo", hutOwner?.aadharNo ? hutOwner?.aadharNo : "-");
    setValue("ownerEmail", hutOwner?.email ? hutOwner?.email : "-");
    setValue("ownerAge", hutOwner?.age ? hutOwner?.age : "-");
    setValue(
      "ownerOccupation",
      hutOwner?.occupation ? hutOwner?.occupation : "-"
    );

    let temp_relation =
      relationDetails &&
      relationDetails.find((obj) => obj.id == hutOwner?.relationKey);
    setValue(
      "ownerRelation",
      language == "en" ? temp_relation?.relation : temp_relation?.relationMr
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
    let temp_villageKey =
      villageDropDown &&
      villageDropDown.find((obj) => obj.id == selectedHut?.villageKey);
    setValue(
      "villageKey",selectedHut?.villageKey
    );

    let temp_areaKey =
      areaDropDown &&
      areaDropDown.find((obj) => obj.id == selectedHut?.areaKey);
    setValue(
      "areaKey",selectedHut?.areaKey
    );

    let temp_slumKey =
      slumDropDown &&
      slumDropDown.find((obj) => obj.id == selectedHut?.slumKey);
    setValue(
      "slumKey",selectedHut?.slumKey
    );

    ////////// set spouse data //////////////

    console.log("spouseData", spouseData);

    // setValue("spouseTitle", spouseData?.title);
    // setValue("spouseFirstName", spouseData?.firstName);
    // setValue("spouseMiddleName", spouseData?.middleName);
    // setValue("spouseLastName", spouseData?.lastName);
    // setValue("spouseFirstNameMr", spouseData?.firstNameMr);
    // setValue("spouseMiddleNameMr", spouseData?.middleNameMr);
    // setValue("spouseLastNameMr", spouseData?.lastNameMr);
    // setValue("spouseMobileNo", spouseData?.mobileNo);
    // setValue("spouseAadharNo", spouseData?.aadharNo);
    // setValue("spouseEmail", spouseData?.email);
    // setValue("spouseAge", spouseData?.age);
    // setValue("spouseOccupation", spouseData?.occupation);
    // setValue("spouseRelationKey", spouseData?.relationKey);
  };

  useEffect(() => {
    getSlumData();
    getAreaData();
    getVillageData();
    getTitleData();
    getServiceCharges();
    getRelationDetails();
    getHutData();
    getRequiredDocs();
  }, []);

  const getServiceCharges = () => {
    axios
      .get(
        `${urls.CFCURL}/master/servicecharges/getByServiceId?serviceId=120`,
        { headers: headers }
      )
      .then((r) => {
        let temp = r.data.serviceCharge[0];
        setValue("feesApplicable", temp?.amount);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  const getRequiredDocs = () => {
    axios
      .get(
        `${urls.CFCURL}/master/documentMaster/getDocumentByService?serviceId=120`,
        { headers: headers }
      )
      .then((r) => {
        let temp = r.data.documentMaster;
        setRequiredUploadDoc(temp);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  useEffect(() => {
    console.log("docList ", docList);
  }, [docList]);

  useEffect(() => {
    console.log("requiredUploadDoc ", requiredUploadDoc);
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
  }, [requiredUploadDoc, requiredUploadDoc1]);

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

  useEffect(() => {
    if (hutNoValue != "" && hutNoValue != null) {
      handleSearchHut();
      getOutstandingTaxes();
      getHutData(hutNoValue);
    }
  }, [hutNoValue]);

  const getOutstandingTaxes = (hutNo) => {
    if (hutNo != undefined && hutNo != null) {
      axios
        .get(
          `${urls.SLUMURL}/trnBill/lastBillAgainstHut/hutNo?hutNo=${hutNo}`,
          {
            headers: headers,
          }
        )
        .then((r) => {
          let temp = r.data;
          setPendingBillData(temp);
          if (temp?.balanceAmount > 0) {
            setIsSlumTaxes(true);
            setValue("slumTaxesAmount", temp?.balanceAmount);
          }
        })
        .catch((err) => {
          if (err) {
            setIsOverDuePayment(true);
          }
          // cfcErrorCatchMethod(err, false);
        });
    }
  };

  useEffect(() => {
    if (pendingBillData?.balanceAmount == 0) {
      setIsOverDuePayment(true);
    } else {
      setIsOverDuePayment(false);
    }
  }, [pendingBillData]);

  const handleUploadDocument = (path) => {
    let temp = {
      documentPath: path,
      documentKey: 1,
      documentType: "",
      remark: "",
    };
    setPhoto(temp);
  };
  const handleUploadDocument1 = (path, flag, id) => {
    let temp;
    setSelfDeclarationFlag(true);

    if (flag) {
      temp = {
        activeFlag: "Y",
        documentPath: path,
        documentKey: 121,
        documentType: "",
        remark: "",
        id: id,
      };
    } else {
      temp = {
        documentPath: path,
        documentKey: 121,
        documentType: "",
        remark: "",
      };
    }

    setPhoto1(temp);
  };

  const handleUploadDocument2 = (path, flag, id) => {
    setSelfAttestationFlag(true);
    let temp;
    if (flag) {
      temp = {
        activeFlag: "Y",
        documentPath: path,
        documentKey: 122,
        documentType: "",
        remark: "",
        id: id,
      };
    } else {
      temp = {
        documentPath: path,
        documentKey: 122,
        documentType: "",
        remark: "",
      };
    }
    setPhoto2(temp);
  };

  const getTitleData = () => {
    axios
      .get(`${urls.CFCURL}/master/title/getAll`, { headers: headers })
      .then((r) => {
        let result = r.data.title;
        let res =
          result &&
          result.map((r) => {
            return {
              id: r.id,
              titleEn: r.title,
              titleMr: r.titleMr,
            };
          });
        setTitleDropDown(res);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  const getHutData = (selectedId) => {
    axios
      .get(`${urls.SLUMURL}/mstHut/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.mstHutList;

        setHutDataList(
          result &&
            result.map((each) => {
              return each.hutNo;
            })
        );

        let selectedHut =
          result && result.find((obj) => obj.hutNo == selectedId);

        let hutOwner =
          selectedHut &&
          selectedHut.mstHutMembersList.find((obj) => obj.headOfFamily === "Y");
        let spouseData =
          selectedHut &&
          selectedHut.mstHutMembersList.find(
            (obj) =>
              (hutOwner?.genderKey == 1 && obj.relationKey == 2) ||
              (hutOwner?.genderKey == 2 && obj.relationKey == 1)
          );

        setHutOwnerData(hutOwner);
        setHutKey(selectedHut?.id);
        setSpouseDetails(spouseData);
        // getOutstandingTaxes(selectedHut?.hutNo);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // handle search connections
  const handleSearchHut = () => {
    setIsLoading(true);
    axios
      .get(`${urls.SLUMURL}/mstHut/search/hutNo?hutNo=${hutNoValue}`, {
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
        cfcErrorCatchMethod(err, false);
      });
  };

  const getVillageData = () => {
    axios
      .get(`${urls.SLUMURL}/master/village/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.village;
       
        let temp =
        result && result.find((obj) => obj.id == selectedHutData?.villageKey);

        setVillageDropDown(result);
      })
      .catch((err) => {
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
        let temp = result && result.find((obj) => obj.id == selectedHutData?.slumKey);
        setSlumDropDown(result);
      })
      .catch((err) => {
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
        let temp = result && result.find((obj) => obj.id == selectedHutData?.areaKey);
        setAreaDropDown(result);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  const handleOnSubmit = (formData) => {
    setIsLoading(true);

    let cleanedTransactionDocumentsList = [];
    // if (photoPassDetails === null) {
    //   cleanedTransactionDocumentsList = docList?.map((document) => {
    //     return { ...document, id: null };
    //   });
    // } else {
    //   cleanedTransactionDocumentsList = docList;
    // }

    let isDraft = window.event.submitter.name === "draft";
    setIsDraft(isDraft);
    // let docList = [];
    delete selectedHutData?.id;

    let body = {
      ...photoPassDetails,
      ...formData,
      applicantTitle: hutOwnerData?.title,
      applicantFirstName: hutOwnerData?.firstName,
      applicantFirstNameMr: hutOwnerData?.firstNameMr,
      applicantMiddleName: hutOwnerData?.middleName,
      applicantMiddleNameMr: hutOwnerData?.middleNameMr,
      applicantLastName: hutOwnerData?.lastName,
      applicantLastNameMr: hutOwnerData?.lastNameMr,
      applicantMobileNo: hutOwnerData?.mobileNo,
      applicantAadharNo: hutOwnerData?.aadharNo,
      applicantEmailId: hutOwnerData?.email,
      applicantAge: hutOwnerData?.age,
      applicantOccupation: hutOwnerData?.occupation,
      applicantRelationKey: hutOwnerData?.relationKey,

      coApplicantTitle: formData?.spouseTitle,
      coApplicantFirstName: formData?.spouseFirstName,
      coApplicantFirstNameMr: formData?.spouseFirstNameMr,
      coApplicantMiddleName: formData?.spouseMiddleName,
      coApplicantMiddleNameMr: formData?.spouseMiddleNameMr,
      coApplicantLastName: formData?.spouseLastName,
      coApplicantLastNameMr: formData?.spouseLastNameMr,
      coApplicantMobileNo: formData?.spouseMobileNo,
      coApplicantAadharNo: formData?.spouseAadharNo,
      coApplicantEmail: formData?.spouseEmail,
      coApplicantAge: formData?.spouseAge,
      coApplicantOccupation: formData?.spouseOccupation,
      coApplicantRelationKey: formData?.spouseRelationKey,
      hutKey: hutKey,
      saveAsDraft: isDraft,
      id: router.query.id,
      // transactionDocumentsList: docList,
      husbandWifeCombinedPhoto: photo?.documentPath,
      feesApplicable: watch("feesApplicable"),
      transactionDocumentsList: docList,
    };

    // let body = {
    //   ...photoPassDetails,
    //   ...formData,
    //   ...selectedHutData,
    //   hutKey: hutKey,
    //   transactionDocumentsList: docList,
    //   saveAsDraft: isDraft,
    //   husbandWifeCombinedPhoto: photo?.documentPath,
    // };

    const tempData = axios
      .post(`${urls.SLUMURL}/trnIssuePhotopass/save`, body, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          if (isDraft) {
            sweetAlert({
              title: language === "en" ? "Updated!" : "अपडेट केले",
              text:
                language === "en"
                  ? "Photopass Application is Updated successfully !"
                  : "फोटोपास अर्ज मसुद्यात यशस्वीरित्या अपडेट केले आहे!",
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
            });
            setSpouseDetails({});
          } else {
            savePhotopass(res.data);
          }
        } else {
          sweetAlert(
            language === "en" ? "Error!" : "त्रुटी!",
            language === "en" ? "Something Went Wrong !" : "काहीतरी चूक झाली !",
            language === "en" ? "error" : "त्रुटी",
            { button: language === "en" ? "Ok" : "ठीक आहे" }
          );
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  const savePhotopass = (data) => {
    sweetAlert({
      title: language === "en" ? "Updated!" : "अपडेट केले",
      text:
        language === "en"
          ? "Photopass Application Updated successfully !"
          : "फोटोपास अर्ज यशस्वीरित्या अपडेट केले!",
      icon: "success",
      dangerMode: false,
      closeOnClickOutside: false,
      button: language === "en" ? "Ok" : "ठीक आहे",
    }).then((will) => {
      if (will) {
        setSpouseDetails({});
        sweetAlert({
          text:
            language === "en"
              ? ` Your Issuance of Photopass Application No Is : ${
                  data.message.split("[")[1].split("]")[0]
                }`
              : ` तुमचा फोटोपास अर्ज जारी क्रमांक आहे : ${
                  data.message.split("[")[1].split("]")[0]
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
                "/SlumBillingManagementSystem/transactions/acknowledgement/issuanceOfPhotopass",
              query: { id: data.message.split("[")[1].split("]")[0] },
            });
          }
        });
      }
    });
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
            language === "en" ? "Success!" : "यशस्वी!",
            language === "en"
              ? " Payment Done Successfull !"
              : "पेमेंट यशस्वी झाले!",
            "success",
            { button: language === "en" ? "Ok" : "ठीक आहे" }
          );
        } else {
          setIsSlumTaxes(true);
          setIsOverDuePayment(false);
          sweetAlert(
            language === "en" ? "Pending!" : "प्रलंबित!",
            language === "en"
              ? `Still your pending balace is ${temp?.balanceAmount}, Please preceed your payment! `
              : `अजूनही तुमची प्रलंबित रक्कम ${temp?.balanceAmount} आहे, कृपया तुमच्या पेमेंट करा! `,
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
      // field: language == "en" ? "documentChecklistEn" : "documentChecklistMr",
      field: "documentChecklistMr",
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
              uploadDoc={requiredUploadDoc}
              setUploadDoc={setRequiredUploadDoc}
              filePath={(path) => {
                handleOnChange(params.row.id, path, params.row.typeOfDocument);
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
            marginBottom: 10,
            padding: 1,
          }}
        >
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleOnSubmit)}>
              {/********* Search Hut Nos *********/}

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
                      <FormattedLabel id="insuranceOfPhotopass" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>

              <Grid container spacing={2} sx={{ padding: "1rem" }}>
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                  <Autocomplete
                    value={hutNoValue}
                    fullWidth
                    onChange={(event, newValue) => {
                      setHutNoValue(newValue);
                    }}
                    options={hutDataList}
                    renderInput={(params) => (
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        {...params}
                        variant="standard"
                        InputLabelProps={{
                          shrink: watch("hutNo"),
                        }}
                        label={<FormattedLabel id="hutNo" />}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              {openEntryConnections && (
                <>
                  {/********* Hut Owner Information *********/}

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
                          error?.ownerFirstName
                            ? error.ownerFirstName.message
                            : null
                        }
                      />
                    </Grid>

                    {/* firstName Marathi */}
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <TextField
                        disabled={true}
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        label={<FormattedLabel id="firstNamemr" />}
                        variant="standard"
                        value={watch("ownerFirstNameMr")}
                        InputLabelProps={{
                          shrink: watch("ownerFirstNameMr") ? true : false,
                        }}
                        error={!!error.ownerFirstNameMr}
                        helperText={
                          error?.ownerFirstNameMr
                            ? error.ownerFirstNameMr.message
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

                    {/* middleName Marathi */}
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <TextField
                        disabled={true}
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        label={<FormattedLabel id="middleNamemr" />}
                        variant="standard"
                        value={watch("ownerMiddleNameMr")}
                        InputLabelProps={{
                          shrink: watch("ownerMiddleNameMr") ? true : false,
                        }}
                        error={!!error.ownerMiddleNameMr}
                        helperText={
                          error?.ownerMiddleNameMr
                            ? error.ownerMiddleNameMr.message
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
                          error?.ownerLastName
                            ? error.ownerLastName.message
                            : null
                        }
                      />
                    </Grid>

                    {/* lastName Marathi */}
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <TextField
                        disabled={true}
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        label={<FormattedLabel id="lastNamemr" />}
                        variant="standard"
                        value={watch("ownerLastNameMr")}
                        InputLabelProps={{
                          shrink: watch("ownerLastNameMr") ? true : false,
                        }}
                        error={!!error.ownerLastNameMr}
                        helperText={
                          error?.ownerLastNameMr
                            ? error.ownerLastNameMr.message
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
                        value={watch("ownerMobileNo")}
                        InputLabelProps={{
                          shrink: watch("ownerMobileNo") ? true : false,
                        }}
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
                          error?.ownerAadharNo
                            ? error.ownerAadharNo.message
                            : null
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
                        helperText={
                          error?.ownerAge ? error.ownerAge.message : null
                        }
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
                          error?.ownerRelation
                            ? error.ownerRelation.message
                            : null
                        }
                      />
                    </Grid>

                    {/* Slum Name */}
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      
                      <FormControl
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        variant="standard"
                        error={!!error.slumKey}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="slumName" />
                        </InputLabel>
                        <Controller
                          disabled
                          render={({ field }) => (
                            <Select
                              disabled
                              // disabled={watch("spouseTitle")}
                              sx={{ width: "100%" }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="slumKey"
                            >
                              {slumDropDown &&
                                slumDropDown.map((value, index) => (
                                  <MenuItem key={index} value={value.id}>
                                    {language == "en"
                                      ? value.slumName
                                      : value?.slumNameMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="slumKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {error?.slumKey ? error.slumKey.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    {/* Area */}
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <FormControl
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        variant="standard"
                        error={!!error.areaKey}
                      >
                        <InputLabel
                          id="demo-simple-select-standard-label"
                          shrink={watch("areaKey") == null ? false : true}
                        >
                          <FormattedLabel id="area" />
                        </InputLabel>
                        <Controller
                          disabled
                          render={({ field }) => (
                            <Select
                              disabled
                              sx={{ width: "100%" }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="areaKey"
                            >
                              {areaDropDown &&
                                areaDropDown.map((value, index) => (
                                  <MenuItem key={index} value={value.id}>
                                    {language == "en"
                                      ? value.areaName
                                      : value?.areaNameMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="areaKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {error?.areaKey ? error.areaKey.message : null}
                        </FormHelperText>
                      </FormControl>
               
                    </Grid>

                    {/* Village */}
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <FormControl
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        variant="standard"
                        error={!!error.villageKey}
                      >
                        <InputLabel
                          id="demo-simple-select-standard-label"
                          shrink={watch("villageKey") == null ? false : true}
                        >
                          <FormattedLabel id="village" />
                        </InputLabel>
                        <Controller
                          // disabled
                          render={({ field }) => (
                            <Select
                              disabled
                              sx={{ width: "100%" }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="villageKey"
                            >
                              {villageDropDown &&
                                villageDropDown.map((value, index) => (
                                  <MenuItem key={index} value={value.id}>
                                    {language == "en"
                                      ? value.villageName
                                      : value?.villageNameMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="villageKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {error?.villageKey ? error.villageKey.message : null}
                        </FormHelperText>
                      </FormControl>
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
                        helperText={
                          error?.pincode ? error.pincode.message : null
                        }
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
                        helperText={
                          error?.lattitude ? error.lattitude.message : null
                        }
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
                        helperText={
                          error?.longitude ? error.longitude.message : null
                        }
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

                  <Grid container spacing={2} sx={{ padding: "1rem" }}>
                    {/* Spouse Title */}
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <FormControl
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        variant="standard"
                        error={!!error.spouseTitle}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="title" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              // disabled={watch("spouseTitle")}
                              sx={{ width: "100%" }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="spouseTitle"
                            >
                              {titleDropDown &&
                                titleDropDown.map((value, index) => (
                                  <MenuItem key={index} value={value.id}>
                                    {language == "en"
                                      ? value.titleEn
                                      : value?.titleMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="spouseTitle"
                          control={control}
                          defaultValue=""
                          InputLabelProps={{
                            shrink: watch("spouseTitle") ? true : false,
                          }}
                        />
                        <FormHelperText>
                          {error?.spouseTitle
                            ? error.spouseTitle.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <>
                      {/*spouse First Name */}
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <Transliteration
                          variant={"standard"}
                          _key={"spouseFirstName"}
                          labelName={"spouseFirstName"}
                          fieldName={"spouseFirstName"}
                          updateFieldName={"spouseFirstNameMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          label={<FormattedLabel id="firstNameEn" required />}
                          error={!!error.spouseFirstName}
                          helperText={
                            error?.spouseFirstName
                              ? error.spouseFirstName.message
                              : null
                          }
                        />
                      </Grid>

                      {/*spouse Middle Name */}
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <Transliteration
                          variant={"standard"}
                          _key={"spouseMiddleName"}
                          labelName={"spouseMiddleName"}
                          fieldName={"spouseMiddleName"}
                          updateFieldName={"spouseMiddleNameMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          label={<FormattedLabel id="middleNameEn" required />}
                          error={!!error.spouseMiddleName}
                          helperText={
                            error?.spouseMiddleName
                              ? error.spouseMiddleName.message
                              : null
                          }
                        />
                      </Grid>
                      {/* spouse Last Name */}
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <Transliteration
                          variant={"standard"}
                          _key={"spouseLastName"}
                          labelName={"spouseLastName"}
                          fieldName={"spouseLastName"}
                          updateFieldName={"spouseLastNameMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          label={<FormattedLabel id="lastNameEn" required />}
                          error={!!error.spouseLastName}
                          helperText={
                            error?.spouseLastName
                              ? error.spouseLastName.message
                              : null
                          }
                        />
                      </Grid>

                      {/* spouse First Name mr*/}
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <Transliteration
                          variant={"standard"}
                          _key={"spouseFirstNameMr"}
                          labelName={"spouseFirstNameMr"}
                          fieldName={"spouseFirstNameMr"}
                          updateFieldName={"spouseFirstName"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          label={<FormattedLabel id="firstNamemr" required />}
                          error={!!error.spouseFirstNameMr}
                          helperText={
                            error?.spouseFirstNameMr
                              ? error.spouseFirstNameMr.message
                              : null
                          }
                        />
                      </Grid>

                      {/*spouse Middle Name Mr*/}
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <Transliteration
                          variant={"standard"}
                          _key={"spouseMiddleNameMr"}
                          labelName={"spouseMiddleNameMr"}
                          fieldName={"spouseMiddleNameMr"}
                          updateFieldName={"spouseMiddleName"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          label={<FormattedLabel id="middleNamemr" required />}
                          error={!!error.spouseMiddleNameMr}
                          helperText={
                            error?.spouseMiddleNameMr
                              ? error.spouseMiddleNameMr.message
                              : null
                          }
                        />
                      </Grid>
                      {/* spouse Last NameMr*/}
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <Transliteration
                          variant={"standard"}
                          _key={"spouseLastNameMr"}
                          labelName={"spouseLastNameMr"}
                          fieldName={"spouseLastNameMr"}
                          updateFieldName={"spouseLastName"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          label={<FormattedLabel id="lastNamemr" required />}
                          error={!!error.spouseLastNameMr}
                          helperText={
                            error?.spouseLastNameMr
                              ? error.spouseLastNameMr.message
                              : null
                          }
                        />
                      </Grid>
                    </>

                    {/* Spouse mobileNo */}
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <TextField
                        // disabled={watch("spouseMobileNo")}
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        label={<FormattedLabel id="mobileNo" />}
                        variant="standard"
                        inputProps={{ maxLength: 10 }}
                        {...register("spouseMobileNo")}
                        InputLabelProps={{
                          shrink: watch("spouseMobileNo") ? true : false,
                        }}
                        error={!!error.spouseMobileNo}
                        helperText={
                          error?.spouseMobileNo
                            ? error.spouseMobileNo.message
                            : null
                        }
                      />
                    </Grid>

                    {/* Spouse aadharNo */}
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <TextField
                        // disabled={watch("spouseAadharNo")}
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        label={<FormattedLabel id="aadharNo" />}
                        inputProps={{ maxLength: 12 }}
                        variant="standard"
                        {...register("spouseAadharNo")}
                        InputLabelProps={{
                          shrink: watch("spouseAadharNo") ? true : false,
                        }}
                        error={!!error.spouseAadharNo}
                        helperText={
                          error?.spouseAadharNo
                            ? error.spouseAadharNo.message
                            : null
                        }
                      />
                    </Grid>

                    {/* Spouse email */}
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <TextField
                        // disabled={watch("spouseEmail")}
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
                        // disabled={watch("spouseAge")}
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        label={<FormattedLabel id="age" />}
                        inputProps={{ maxLength: 3 }}
                        variant="standard"
                        {...register("spouseAge")}
                        InputLabelProps={{
                          shrink: watch("spouseAge") ? true : false,
                        }}
                        error={!!error.spouseAge}
                        helperText={
                          error?.spouseAge ? error.spouseAge.message : null
                        }
                      />
                    </Grid>

                    {/* Spouse occupation */}
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <TextField
                        // disabled={watch("spouseOccupation")}
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
                      <FormControl
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        variant="standard"
                        error={!!error.spouseRelationKey}
                      >
                        <InputLabel
                          id="demo-simple-select-standard-label"
                          // disabled={isDisabled}
                        >
                          <FormattedLabel id="relation" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              // disabled={watch("spouseRelationKey")}
                              sx={{ width: "100%" }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value);
                              }}
                            >
                              {relationDetails &&
                                relationDetails.map((value, index) => (
                                  <MenuItem key={index} value={value?.id}>
                                    {language == "en"
                                      ? value?.relation
                                      : value?.relationMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="spouseRelationKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {error?.spouseRelationKey
                            ? error.spouseRelationKey.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    {/* Spouse Upload Photos */}
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <label>
                        <b>
                          <FormattedLabel id="husbandWifePhoto" required /> :
                        </b>
                      </label>
                    </Grid>

                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <UploadButton
                        appName="SLUM"
                        serviceName="SLUM-IssuancePhotopass"
                        filePath={(path) => {
                          handleUploadDocument(path);
                        }}
                        fileName={photo && photo.documentPath}
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
                        rows={docList}
                        columns={attachFileColumns}
                        pageSize={6}
                        rowsPerPageOptions={[6]}
                      />
                    </Grid>
                  </>

                  {/********* Outstanding Taxes *********/}

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
                    {/* Slum taxes amount */}
                    <Grid item xl={7} lg={7} md={7} sm={6} xs={12}>
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
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 2,
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

                  {isSlumTaxes ? (
                    <Grid
                      container
                      spacing={2}
                      sx={{
                        marginLeft: "1rem",
                        padding: "1rem 1rem 0 1rem",
                        backgroundColor: "red",
                        width: "fit-content",
                        borderRadius: "1rem",
                        animation: `${blinkAnimation} 2s infinite`,
                      }}
                    >
                      <p style={{ color: "yellow" }}>
                        <b>
                          {language == "en"
                            ? "Until pending dues are not cleared, You can not submit this application"
                            : "जोपर्यंत प्रलंबित थकबाकी भरली जात नाही तोपर्यंत तुम्ही हा अर्ज सबमिट करू शकत नाही"}
                        </b>
                      </p>
                    </Grid>
                  ) : (
                    <></>
                  )}

                  {/********* Generate Documents *********/}

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
                          <FormattedLabel id="generateDocuments" />
                        </h3>
                      </Grid>
                    </Grid>
                  </Box>

                  <Grid container spacing={2} sx={{ padding: "1rem" }}>
                    {/* Pending Payments */}
                    <Grid
                      item
                      xl={7}
                      lg={7}
                      md={7}
                      sm={7}
                      xs={12}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <label>
                        <b>
                          <FormattedLabel id="selfDeclarationForm" />
                        </b>
                      </label>
                    </Grid>

                    <Grid
                      item
                      xl={2}
                      lg={2}
                      md={2}
                      sm={2}
                      xs={12}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      {selfDeclarationFlag ? (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => {
                            if (hutOwnerData) {
                              handleOpen();
                              setChoice("selfDeclaration");
                            } else {
                              sweetAlert({
                                title:
                                  language === "en"
                                    ? "Please Select Hut no"
                                    : "कृपया झोपडी क्रमांक निवडा",
                                button: language === "en" ? "Ok" : "ठीक आहे",
                              });
                            }
                          }}
                        >
                          {language === "en" ? "Preview" : "पूर्वावलोकन"}
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => {
                            if (hutOwnerData) {
                              handleOpen();
                              setChoice("selfDeclaration");
                            } else {
                              sweetAlert({
                                title:
                                  language === "en"
                                    ? "Please Select Hut no"
                                    : "कृपया झोपडी क्रमांक निवडा",
                                button: language === "en" ? "Ok" : "ठीक आहे",
                              });
                            }
                          }}
                        >
                          <FormattedLabel id="generate" />
                        </Button>
                      )}
                    </Grid>
                    <Grid
                      item
                      xl={2}
                      lg={2}
                      md={2}
                      sm={2}
                      xs={12}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <UploadButton
                        appName="SLUM"
                        serviceName="SLUM-IssuancePhotopass"
                        filePath={(path) => {
                          handleUploadDocument1(path, false, null);
                        }}
                        fileName={photo1 && photo1.documentPath}
                      />
                    </Grid>
                  </Grid>

                  {/* Pending Payments */}
                  <Grid container spacing={2} sx={{ padding: "1rem" }}>
                    <Grid
                      item
                      xl={7}
                      lg={7}
                      md={7}
                      sm={7}
                      xs={12}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <label>
                        <b>
                          <FormattedLabel id="selfAttestation" />
                        </b>
                      </label>
                    </Grid>

                    <Grid
                      item
                      xl={2}
                      lg={2}
                      md={2}
                      sm={2}
                      xs={12}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      {selfAttestationFlag ? (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => {
                            if (hutOwnerData) {
                              setChoice("selfAttestation");
                              handleOpen();
                            } else {
                              sweetAlert({
                                title:
                                  language === "en"
                                    ? "Please Select Hut no"
                                    : "कृपया झोपडी क्रमांक निवडा",
                                button: language === "en" ? "Ok" : "ठीक आहे",
                              });
                            }
                          }}
                        >
                          {" "}
                          {language === "en" ? "Preview" : "पूर्वावलोकन"}
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => {
                            if (hutOwnerData) {
                              setChoice("selfAttestation");
                              handleOpen();
                            } else {
                              sweetAlert({
                                title:
                                  language === "en"
                                    ? "Please Select Hut no"
                                    : "कृपया झोपडी क्रमांक निवडा",
                                button: language === "en" ? "Ok" : "ठीक आहे",
                              });
                            }
                          }}
                        >
                          {" "}
                          <FormattedLabel id="generate" />
                        </Button>
                      )}
                    </Grid>
                    <Grid
                      item
                      xl={2}
                      lg={2}
                      md={2}
                      sm={2}
                      xs={12}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <UploadButton
                        appName="SLUM"
                        serviceName="SLUM-IssuancePhotopass"
                        filePath={(path) => {
                          handleUploadDocument2(path, false, null);
                        }}
                        fileName={photo2 && photo2.documentPath}
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
                          <FormattedLabel id="revertedSection" />
                        </h3>
                      </Grid>
                    </Grid>
                  </Box>
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
                      disabled={true}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      label={<FormattedLabel id="clerkApprovalRemark" />}
                      inputProps={{ maxLength: 500 }}
                      variant="standard"
                      // {...register("clerkApprovalRemark")}
                      {...register("clerkApprovalRemark")}
                      InputLabelProps={{
                        shrink:
                          router.query.id || watch("clerkApprovalRemark")
                            ? true
                            : false,
                      }}
                      onChange={(e) =>
                        handleRemarkChange(e, "clerkApprovalRemark")
                      }
                      error={!!error.clerkApprovalRemark}
                      helperText={
                        error?.clerkApprovalRemark
                          ? error.clerkApprovalRemark.message
                          : null
                      }
                    />
                  </Grid>
                  {/* Buttons Row */}
                  <Grid container spacing={2} sx={{ padding: "1rem" }}>
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
                        marginTop: "10px",
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
                        size="small"
                        type="submit"
                        disabled={
                          // !isOverDuePayment ||
                          (selfDeclarationFlag && selfAttestationFlag
                            ? false
                            : true) ||
                          !photo ||
                          !photo.documentPath
                        }
                        endIcon={<Save />}
                        onClick={() => handleSaveAsDraft("save")}
                      >
                        <FormattedLabel id="update" />
                      </Button>
                    </Grid>
                   
                  </Grid>
                </>
              )}

              {/* View Demand Letter */}
              <div>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    {choice &&
                      choice === "selfDeclaration" &&
                      selectedHutData && (
                        <SelfDeclaration
                          hutOwnerData={hutOwnerData}
                          husbandWifeCombinedPhoto={photo?.documentPath}
                          hutData={selectedHutData}
                          handleClose={handleClose}
                          setSelfDeclarationFlag={setSelfDeclarationFlag}
                          selfDeclarationFlag={selfDeclarationFlag}
                        />
                      )}
                    {choice &&
                      choice === "selfAttestation" &&
                      selectedHutData && (
                        <SelfAttestation
                          hutOwnerData={hutOwnerData}
                          husbandWifeCombinedPhoto={photo?.documentPath}
                          hutData={selectedHutData}
                          handleClose={handleClose}
                          setSelfAttestationFlag={setSelfAttestationFlag}
                          selfAttestationFlag={selfAttestationFlag}
                        />
                      )}
                  </Box>
                </Modal>
              </div>

              <div>
                <Modal
                  title="Modal For Payment"
                  open={isModalOpenForResolved}
                  onOk={true}
                  onClose={handleCancel}
                  footer=""
                  sx={{
                    padding: 5,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: "90%",
                      backgroundColor: "white",
                      height: "40vh",
                    }}
                  >
                    <Box style={{ height: "60vh" }}>
                      <>
                        <Grid container spacing={2} sx={{ padding: "1rem" }}>
                          <Grid
                            item
                            spacing={3}
                            xl={6}
                            lg={6}
                            md={6}
                            sm={12}
                            xs={12}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginTop: 20,
                            }}
                          >
                            <Button
                              variant="contained"
                              size="small"
                              color="primary"
                              endIcon={<ExitToAppIcon />}
                              onClick={() => changePaymentStatus()}
                            >
                              <FormattedLabel id="payment" />
                            </Button>
                          </Grid>
                          <Grid
                            item
                            spacing={3}
                            xl={6}
                            lg={6}
                            md={6}
                            sm={12}
                            xs={12}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginTop: 20,
                            }}
                          >
                            <Button
                              sx={{ marginRight: 8 }}
                              variant="contained"
                              size="small"
                              color="error"
                              endIcon={<ClearIcon />}
                              onClick={() => handleCancel()}
                            >
                              <FormattedLabel id="closeModal" />
                            </Button>
                          </Grid>
                        </Grid>
                      </>
                    </Box>
                  </Box>
                </Modal>
              </div>
            </form>
          </FormProvider>
        </Paper>
      </ThemeProvider>
    </>
  );
};

export default Index;
