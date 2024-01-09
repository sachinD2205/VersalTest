import React, { useEffect, useRef, useState } from "react";
import router from "next/router";
import {
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  ThemeProvider,
  IconButton,
  FormControl,
  FormHelperText,
  InputLabel,
  Box,
  Grid,
  Modal,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Controller, useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import sweetAlert from "sweetalert";
import schema from "../../../../../containers/schema/slumManagementSchema/issuanceOfNocSchema";
import saveAsDraftSchema from "../../../../../containers/schema/slumManagementSchema/saveAsDraftIssuanceOfNocSchema";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import theme from "../../../../../theme";
import UploadButton from "../../../../../components/SlumBillingManagementSystem/FileUpload/UploadButton copy";
import { ExitToApp, Save } from "@mui/icons-material";
import axios from "axios";
import urls from "../../../../../URLS/urls";
import { useReactToPrint } from "react-to-print";
import SelfDeclaration from "../generateDocuments/selfDeclaration";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SelfAttestation from "../generateDocuments/selfAttestation";
import ClearIcon from "@mui/icons-material/Clear";
import Autocomplete from "@mui/material/Autocomplete";
import Transliteration from "../../../../../components/common/linguosol/transliteration";
import BreadcrumbComponent from "../../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";
import commonStyles from "../../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../../util/commonErrorUtil";

const Index = () => {
  const [isName, setSaveButtonName] = useState("");
  const handleSaveAsDraft = (name) => {
    setSaveButtonName(name);
  };
  const methods = useForm({
    criteriaMode: "all",
    resolver:
      isName === "draft" ? yupResolver(saveAsDraftSchema) : yupResolver(schema),
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
    height: "80%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    overflow: "scroll",
  };

  const language = useSelector((state) => state.labels.language);
  const user = useSelector((state) => state.user.user);
  const [hutKeyVal, setHutKeyVal] = useState();
  const [nocDetails, setNocDetails] = useState(null);
  const [photo, setPhoto] = useState();
  const [isSlumTaxes, setIsSlumTaxes] = useState(false);
  const [isOverDuePayment, setIsOverDuePayment] = useState(false);
  const [pendingBillData, setPendingBillData] = useState({});
  const [hutNo, setHutNo] = useState("");
  let loggedInUser = localStorage.getItem("loggedInUser");
  const [choice, setChoice] = useState("");
  const [selectedHutData, setSelectedHutData] = useState(null);
  const [hutOwnerData, setHutOwnerData] = useState(null);
  const [selfDeclarationFlag, setSelfDeclarationFlag] = useState(false);
  const [selfAttestationFlag, setSelfAttestationFlag] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openEntryConnections, setOpenEntryConnections] = React.useState(false);
  const [hutOptions, setHutOptions] = useState([]);
  const handleCancel = () => setIsModalOpenForResolved(false);
  const [isModalOpenForResolved, setIsModalOpenForResolved] = useState(false);
  const [docUpload, setDocUpload] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [slumDropDown, setSlumDropDown] = useState([]);
  const [areaDropDown, setAreaDropDown] = useState([]);
  const [villageDropDown, setVillageDropDown] = useState([]);
  const [titleDropDown, setTitleDropDown] = useState([]);
  const [hutOwnerDataUI, setHutOwnerDataUI] = useState(null);
  const [hutDataofOwner, setHutDataofOwner] = useState(null);
  const [docList, setDocList] = useState([]);
  const [requiredUploadDoc, setRequiredUploadDoc] = useState(null);
  const [requiredUploadDoc1, setRequiredUploadDoc1] = useState(null);
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
  useEffect(() => {
    if (hutKeyVal != null && hutKeyVal != undefined) {
      getHutOwnerDetailsByHutKey();
    }
  }, [hutKeyVal]);

  useEffect(() => {
    if (selectedHutData != null && hutOwnerData != null) {
      setDataOnUI();
    }
  }, [selectedHutData, hutOwnerData, language]);


  // useEffect(()=>{
  //   if(selectedHutData!=null&& selectedHutData!=undefined){
  //     console.log('selectedHutData', selectedHutData[0])
  //     getSlumData();
  //   }
  // },[selectedHutData])
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

  const headers ={ Authorization: `Bearer ${user?.token}` };

  const setDataOnUI = () => {
    let selectedHut = selectedHutData[0];
    let hutOwner = hutOwnerData;
    setHutKeyVal(selectedHut?.id);
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
      !hutOwner
        ? "-"
        : language == "en"
        ? hutOwner?.firstName
        : hutOwner?.firstNameMr
    );
    setValue(
      "ownerMiddleName",
      !hutOwner?.middleName
        ? "-"
        : language == "en"
        ? hutOwner?.middleName
        : hutOwner?.middleNameMr
    );
    setValue(
      "ownerLastName",
      !hutOwner?.lastName
        ? "-"
        : language == "en"
        ? hutOwner?.lastName
        : hutOwner?.lastNameMr
    );
    setValue("ownerMobileNo", hutOwner?.mobileNo ? hutOwner?.mobileNo : "-");
    setValue("ownerAadharNo", hutOwner?.aadharNo ? hutOwner?.aadharNo : "-");
    setValue("ownerEmailId", hutOwner?.emailId ? hutOwner?.emailId : "-");
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
      "villageKey",
      language == "en" ? temp_villageKey?.villageEn : temp_villageKey?.villageMr
    );

    let temp_areaKey =
      areaDropDown &&
      areaDropDown.find((obj) => obj.id == selectedHut?.areaKey);
    setValue(
      "areaKey",
      language == "en" ? temp_areaKey?.areaEn : temp_areaKey?.areaMr
    );

    let temp_slumKey =
      slumDropDown &&
      slumDropDown.find((obj) => obj.id == selectedHut?.slumKey);
    setValue(
      "slumKey",
      language == "en" ? temp_slumKey?.slumName : temp_slumKey?.slumNameMr
    );
  };

  useEffect(() => {
    if (router.query.id != null && router.query.id != undefined) {
      getIssuanceOfNocById();
    }
  }, [router.query.id]);

  useEffect(() => {
    getSlumData()
    getAreaData();
    getVillageData();
    getHutData();
    getTitleData();
    getServiceCharges();
    getRequiredDocs();
    setValue("noOfCopies", 1);
  }, []);

  const getServiceCharges = () => {
    axios
      .get(`${urls.CFCURL}/master/servicecharges/getByServiceId?serviceId=129`, {
        headers: headers,
      })
      .then((r) => {
        let temp = r.data.serviceCharge[0];
        setValue("feesApplicable", watch("noOfCopies") * temp?.amount);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, true);
      });
  };
  const getRequiredDocs = () => {
    axios
      .get(
        `${urls.CFCURL}/master/documentMaster/getDocumentByService?serviceId=129`, {
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


  useEffect(()=>{
    if(router.query.id){
      setDocList(
        requiredUploadDoc1?.map((row, i) => ({
          srNo: i + 1,
          id: row.id,
          documentChecklistEn:requiredUploadDoc&&requiredUploadDoc.find((obj)=>obj.id===row.documentKey)?.documentChecklistEn,
          documentChecklistMr: requiredUploadDoc&&requiredUploadDoc.find((obj)=>obj.id===row.documentKey)?.documentChecklistMr,
          typeOfDocument: row.typeOfDocument,
          // service: row.service,
          documentPath:row.documentPath,
          activeFlag: row.activeFlag,
          documentKey:row.documentKey,
          activeFlag:'Y',
          // application: row.application,
        }))
      );
    }else{
      setDocList(
        requiredUploadDoc?.map((row, i) => ({
          srNo: i + 1,
          id: row.id,
          documentChecklistEn: row.documentChecklistEn,
          documentChecklistMr: row.documentChecklistMr,
          typeOfDocument: row.typeOfDocument,
          // service: row.service,
          documentPath:row.documentPath,
          documentKey:row.id,
          activeFlag: row.activeFlag,
          // application: row.application,
        }))
      );
    }
   
  },[requiredUploadDoc,requiredUploadDoc1])



  const getIssuanceOfNocById = () => {
    setIsLoading(true);
    axios
      .get(`${urls.SLUMURL}/trnIssueNoc/getById?id=${router.query.id}`, {
        headers: headers,
      })
      .then((r) => {
        setIsLoading(false);
        let temp = r.data;
        setNocDetails(temp);
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  useEffect(() => {
    if (nocDetails != null) fetchDataOnUI();
  }, [nocDetails]);

  const fetchDataOnUI = () => {
    let data = nocDetails;
    setHutNo(data.hutNo);
    setValue("purpose", data?.purpose ? data?.purpose : "");
    setValue("hutNo", data.hutNo);
    setValue("applicantFirstName", data.applicantFirstName);
    setValue("applicantMiddleName", data.applicantMiddleName);
    setValue("applicantTitle", data.applicantTitle);
    setValue("applicantFirstNameMr", data.applicantFirstNameMr);
    setValue("applicantMiddleNameMr", data.applicantMiddleNameMr);
    setValue("applicantLastName", data.applicantLastName);
    setValue("applicantLastNameMr", data.applicantLastNameMr);
    setValue("applicantMobileNo", data.applicantMobileNo);
    setValue("applicantAadharNo", data.applicantAadharNo);
    handleUploadDocument(data.applicantPhoto);
    
    const extractedData = data.transactionDocumentsList.map(
      ({ id, documentKey, documentType, documentPath, remark }) => ({
        id,
        documentKey,
        documentType,
        documentPath,
        remark,
      })
    );
    setRequiredUploadDoc1(extractedData);
    setHutKeyVal(data?.hutKey);
    setValue("asOnDate", data.asOnDate);
  };

  const getHutOwnerDetailsByHutKey = () => {
    axios
      .get(`${urls.SLUMURL}/mstHut/getById?id=${hutKeyVal}`, {
        headers: headers,
      })
      .then((r) => {
        setIsLoading(false);
        setHutOwnerDataUI(r);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };

  useEffect(() => {
    if (hutOwnerDataUI != null) {
      let r = hutOwnerDataUI;
      setValue("pincode", r.data.pincode);
      setValue(
        "slumKey",
        language == "en"
          ? slumDropDown &&
              slumDropDown?.find((obj) => obj.id == r.data.slumKey)?.slumName
          : slumDropDown &&
              slumDropDown?.find((obj) => obj.id == r.data.slumKey)?.slumNameMr
      );
      setValue("lattitude", r.data?.lattitude ? r.data?.lattitude : "-");
      setValue("longitude", r.data?.longitude ? r.data?.longitude : "-");
      setValue(
        "villageKey",
        language == "en"
          ? villageDropDown &&
              villageDropDown.find((obj) => obj.id == r.data?.villageKey)
                ?.villageEn
          : villageDropDown &&
              villageDropDown.find((obj) => obj.id == r.data?.villageKey)
                ?.villageMr
      );
      setValue(
        "areaKey",
        language == "en"
          ? areaDropDown &&
              areaDropDown.find((obj) => obj.id == r.data?.areaKey)?.areaEn
          : areaDropDown &&
              areaDropDown.find((obj) => obj.id == r.data?.areaKey)?.areaMr
      );

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
    }
  }, [hutOwnerDataUI, language]);

  useEffect(() => {
    if (hutNo != "" && hutNo != null) {
      handleSearchHut();
      getOutstandingTaxes();
    }
  }, [hutNo]);

  useEffect(() => {
    if (hutDataofOwner != null) {
      let selectedHut =
        hutDataofOwner && hutDataofOwner.find((obj) => obj.hutNo == hutNo);
      let hutOwner =
        selectedHut &&
        selectedHut.mstHutMembersList.find((obj) => obj.headOfFamily === "Y");
      const hutNumbers = hutDataofOwner?.map((hut) => hut.hutNo);
      setHutOptions(hutNumbers);
      setHutOwnerData(hutOwner);
    }
  }, [hutNo, hutDataofOwner]);

  const getOutstandingTaxes = () => {
    if (hutNo !== undefined || hutNo !== null) {
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
            setIsOverDuePayment(false);
            setValue("slumTaxesAmount", temp?.balanceAmount);
          } else {
            setIsSlumTaxes(false);
            setIsOverDuePayment(true);
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

  const handleUploadDocument = (path) => {
    const newDocument = {
      documentPath: path,
    };

    // Update the docUpload state by appending the new document
    setDocUpload([...docUpload, newDocument]);
    let temp = {
      documentPath: path,
      documentKey: 1,
      documentType: "",
      remark: "",
    };
    setPhoto(temp);
  };

  const getTitleData = () => {
    axios.get(`${urls.CFCURL}/master/title/getAll`, {
      headers: headers,
    }).then((r) => {
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
    }).catch((err)=>{
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
        setHutDataofOwner(result);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };

  // handle search connections
  const handleSearchHut = () => {
    setIsLoading(true);
    axios
      .get(`${urls.SLUMURL}/mstHut/search/hutNo?hutNo=${hutNo}`, {
        headers: headers,
      })
      .then((r) => {
        setIsLoading(false);
        let result = r.data.mstHutList;
        setSelectedHutData(result);
        setOpenEntryConnections(true);
      })
      .catch((err) => {
        setIsLoading(false);
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
        let res =
          result &&
          result.map((r) => {
            return {
              id: r.id,
              villageEn: r.villageName,
              villageMr: r.villageNameMr,
            };
          });
        let temp =
          res && res.find((obj) => obj.id == selectedHutData?.villageKey);
        setValue(
          "villageKey",
          !temp ? "-" : language == "en" ? temp?.villageEn : temp?.villageMr
        );
        setVillageDropDown(res);
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
        let res = r.data.mstSlumList;
        // setValue(
        //   "slumKey",
        //   !res ? "-" : language == "en" ? res?.slumName : res?.slumNameMr
        // );
        setSlumDropDown(res);
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
        let res =
          result &&
          result.map((r) => {
            return {
              id: r.id,
              areaEn: r.areaName,
              areaMr: r.areaNameMr,
            };
          });
        let temp = res && res.find((obj) => obj.id == selectedHutData?.areaKey);
        setValue(
          "areaKey",
          !temp ? "-" : language === "en" ? temp?.areaEn : temp?.areaMr
        );
        setAreaDropDown(res);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, true);
      });
  };

  const clearFields = () => {
    reset({
      ownerTitle: "",
      ownerMobileNo: "",
      ownerFirstName: "",
      ownerMiddleName: "",
      ownerEmailId: "",
      ownerLastName: "",
      ownerAadharNo: "",
      title: "",
      firstName: "",
      middleName: "",
      lastName: "",
      mobileNo: "",
      emailId: "",
      aadharNo: "",
      pincode: "",
      areaKey: "",
      villageKey: "",
      cityName: "",
      lattitude: "",
      longitude: "",
      outstandingTaxesAmount: "",
      slumKey: "",
      hutNo: "",
      purpose: "",
    });
  };

  const handleOnChange = (docId, path, typeOfDocument) => {
    let temp = [...docList];
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
            documentType: typeOfDocument,
          };
        } else {
          return each;
        }
      });
    setDocList(res);
  };

  const handleOnSubmit = (formData) => {
    setIsLoading(true);
    let cleanedTransactionDocumentsList=[]
    if(nocDetails===null){
     cleanedTransactionDocumentsList = docList?.map(
      (document) => { return {...document,id:null}
        });
  }else{
     cleanedTransactionDocumentsList =docList
  }
    let isDraft = window.event.submitter.name === "draft";
    let body = {
      activeFlag: "Y",
      ...nocDetails,
      saveAsDraft: isDraft,
      slumKey: selectedHutData[0]?.slumKey,
      hutNo: isDraft === true ? hutNo : formData?.hutNo,
      applicantTitle: formData?.applicantTitle,
      applicantMiddleName: formData?.applicantMiddleName,
      applicantFirstName: formData?.applicantFirstName,
      applicantLastName: formData?.applicantLastName,
      applicantMiddleNameMr: formData?.applicantMiddleNameMr,
      applicantFirstNameMr: formData?.applicantFirstNameMr,
      applicantLastNameMr: formData?.applicantLastNameMr,
      applicantPhoto: photo?.documentPath,
      applicantMobileNo: formData?.applicantMobileNo,
      applicantAadharNo: formData?.applicantAadharNo,
      applicantEmailId: formData?.applicantEmailId,
      areaKey: selectedHutData[0]?.areaKey,
      villageKey: selectedHutData[0]?.villageKey,
      pincode: selectedHutData[0]?.pincode,
      lattitude: selectedHutData[0]?.lattitude,
      longitude: selectedHutData[0]?.longitude,
      purpose: formData?.purpose,
      hutKey: hutKeyVal,
      outstandingTax: null,
      remarks: "test",
      isApproved: null,
      isComplete: null,
      transactionDocumentsList : cleanedTransactionDocumentsList
      // transactionDocumentsList: requiredUploadDoc,
    };
   
    const tempData = axios 
      .post(`${urls.SLUMURL}/trnIssueNoc/save`, body, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          if (isDraft) {
            sweetAlert({
              title: language == "en" ? "Saved!" : "जतन केले",
              text:
                language == "en"
                  ? "Issuance Of Noc Application is Saved in draft successfully !"
                  : "एनओसी अर्ज जारी करणे यशस्वीरित्या मसुद्यात जतन केले आहे!",
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
          } else {
            showAlert(res.data);
          }
        } else {
          sweetAlert({
            title: language === "en" ? "OOPS!" : "अरेरे!",
            text:
              language === "en" ? "Something went wrong!" : "काहीतरी चूक झाली!",
            icon: "error",
            dangerMode: true,
            closeOnClickOutside: false,
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  // };
}

  const showAlert = (data) => {
    sweetAlert({
      title: language == "en" ? "Saved!" : "जतन केले",
      text:
        language == "en"
          ? "Issuance Of Noc Application is Saved successfully !"
          : "एनओसी अर्ज जारी करणे यशस्वीरित्या जतन केले आहे!",
      icon: "success",
      dangerMode: false,
      closeOnClickOutside: false,
      button: language === "en" ? "Ok" : "ठीक आहे",
    }).then((will) => {
      if (will) {
        sweetAlert({
          text:
            language === "en"
              ? ` Your Issuance of Noc Application No Is : ${
                  data.message.split("[")[1].split("]")[0]
                }`
              : `तुमचा एनओसी अर्ज क्रमांक जारी करणे :${
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
                "/SlumBillingManagementSystem/transactions/acknowledgement/issuanceOfNoc",
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
          sweetAlert({
            title: language === "en" ? "Success!" : "यशस्वी!",
            text:
              language === "en"
                ? " Payment Done Successfully !"
                : "पेमेंट यशस्वीरित्या पूर्ण झाले!",
            icon: "success",
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
        } else {
          setIsSlumTaxes(true);
          sweetAlert({
            title: language === "en" ? "Pending!" : "प्रलंबित!",
            text:
              language === "en"
                ? `Still your pending balnace is ${temp?.balanceAmount}, Please preceed your payment! `
                : `अजूनही तुमची शिल्लक आहे ${temp?.balanceAmount}, कृपया तुमचे पेमेंट अगोदर करा! `,
            icon: "error",
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
        }
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
            marginTop: "10px",
            marginBottom: "60px",
            padding: 1,
          }}
        >
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleOnSubmit)}>
              {/* search Slum Address by hut number */}

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
                          shrink: watch("hutNo") || !!params.inputProps?.value,
                        }}
                        label={<FormattedLabel id="hutNo" />}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              {openEntryConnections && (
                <Grid>
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
                        disabled={
                          router.query.pageMode == "view" ? true : false
                        }
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        label={<FormattedLabel id="title" required />}
                        variant="standard"
                        value={watch("ownerTitle")}
                        InputLabelProps={{
                          shrink:
                            router.query.id || watch("ownerTitle")
                              ? true
                              : false,
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
                        disabled={
                          router.query.pageMode == "view" ? true : false
                        }
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        label={<FormattedLabel id="firstName" required />}
                        variant="standard"
                        value={watch("ownerFirstName")}
                        InputLabelProps={{
                          shrink:
                            router.query.id || watch("ownerFirstName")
                              ? true
                              : false,
                        }}
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
                        disabled={
                          router.query.pageMode == "view" ? true : false
                        }
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        label={<FormattedLabel id="middleName" required />}
                        variant="standard"
                        value={watch("ownerMiddleName")}
                        InputLabelProps={{
                          shrink:
                            router.query.id || watch("ownerMiddleName")
                              ? true
                              : false,
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
                        disabled={
                          router.query.pageMode == "view" ? true : false
                        }
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        label={<FormattedLabel id="lastName" required />}
                        variant="standard"
                        value={watch("ownerLastName")}
                        InputLabelProps={{
                          shrink:
                            router.query.id || watch("ownerLastName")
                              ? true
                              : false,
                        }}
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
                        disabled={
                          router.query.pageMode == "view" ? true : false
                        }
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        label={<FormattedLabel id="mobileNo" required />}
                        variant="standard"
                        value={watch("ownerMobileNo")}
                        InputLabelProps={{
                          shrink:
                            router.query.id || watch("ownerMobileNo")
                              ? true
                              : false,
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
                        disabled={
                          router.query.pageMode == "view" ? true : false
                        }
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        label={<FormattedLabel id="aadharNo" required />}
                        variant="standard"
                        value={watch("ownerAadharNo")}
                        InputLabelProps={{
                          shrink:
                            router.query.id || watch("ownerAadharNo")
                              ? true
                              : false,
                        }}
                        error={!!error.ownerAadharNo}
                        helperText={
                          error?.ownerAadharNo
                            ? error.ownerAadharNo.message
                            : null
                        }
                      />
                    </Grid>

                    {/* Slum Name */}
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <TextField
                        disabled={
                          router.query.pageMode == "view" ? true : false
                        }
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        label={<FormattedLabel id="slumName" required />}
                        variant="standard"
                        value={watch("slumKey")}
                        InputLabelProps={{
                          shrink:
                            router.query.id || watch("slumKey") ? true : false,
                        }}
                        error={!!error.slumKey}
                        helperText={
                          error?.slumKey ? error.slumKey.message : null
                        }
                      />
                    </Grid>

                    {/* Area */}
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <TextField
                        disabled={
                          router.query.pageMode == "view" ? true : false
                        }
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        label={<FormattedLabel id="area" required />}
                        variant="standard"
                        value={watch("areaKey")}
                        InputLabelProps={{
                          shrink:
                            router.query.id || watch("areaKey") ? true : false,
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
                        disabled={
                          router.query.pageMode == "view" ? true : false
                        }
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        label={<FormattedLabel id="village" required />}
                        variant="standard"
                        value={watch("villageKey")}
                        InputLabelProps={{
                          shrink:
                            router.query.id || watch("villageKey")
                              ? true
                              : false,
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
                        disabled={
                          router.query.pageMode == "view" ? true : false
                        }
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        label={<FormattedLabel id="pincode" required />}
                        variant="standard"
                        value={watch("pincode")}
                        InputLabelProps={{
                          shrink:
                            router.query.id || watch("pincode") ? true : false,
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
                        disabled={
                          router.query.pageMode == "view" ? true : false
                        }
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        label={<FormattedLabel id="lattitude" required />}
                        variant="standard"
                        value={watch("lattitude")}
                        InputLabelProps={{
                          shrink:
                            router.query.id || watch("lattitude")
                              ? true
                              : false,
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
                        disabled={
                          router.query.pageMode == "view" ? true : false
                        }
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        label={<FormattedLabel id="longitude" required />}
                        variant="standard"
                        value={watch("longitude")}
                        InputLabelProps={{
                          shrink:
                            router.query.id || watch("longitude")
                              ? true
                              : false,
                        }}
                        error={!!error.longitude}
                        helperText={
                          error?.longitude ? error.longitude.message : null
                        }
                      />
                    </Grid>
                  </Grid>

                  {/********* Applicant Information *********/}

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
                    {/* Applicant Title */}
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <FormControl
                        disabled={
                          router.query.pageMode == "view" ? true : false
                        }
                        variant="standard"
                        error={!!error.applicantTitle}
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="title" required />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="applicantTitle"
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
                          name="applicantTitle"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {error?.title ? error.title.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <>
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <Transliteration
                          variant={"standard"}
                          _key={"applicantFirstName"}
                          labelName={"applicantFirstName"}
                          fieldName={"applicantFirstName"}
                          updateFieldName={"applicantFirstNameMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          label={<FormattedLabel id="firstNameEn" required />}
                          error={!!error.applicantFirstName}
                          helperText={
                            error?.applicantFirstName
                              ? error.applicantFirstName.message
                              : null
                          }
                        />
                      </Grid>

                      {/*applicant middle name */}
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <Transliteration
                          variant={"standard"}
                          _key={"applicantMiddleName"}
                          labelName={"applicantMiddleName"}
                          fieldName={"applicantMiddleName"}
                          updateFieldName={"applicantMiddleNameMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          label={<FormattedLabel id="middleNameEn" required />}
                          error={!!error.applicantMiddleName}
                          helperText={
                            error?.applicantMiddleName
                              ? error.applicantMiddleName.message
                              : null
                          }
                        />
                      </Grid>
                      {/* applicant last name */}
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <Transliteration
                          variant={"standard"}
                          _key={"applicantLastName"}
                          labelName={"applicantLastName"}
                          fieldName={"applicantLastName"}
                          updateFieldName={"applicantLastNameMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          label={<FormattedLabel id="lastNameEn" required />}
                          error={!!error.applicantLastName}
                          helperText={
                            error?.applicantLastName
                              ? error.applicantLastName.message
                              : null
                          }
                        />
                      </Grid>

                      {/* applicant first name mr*/}
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <Transliteration
                          variant={"standard"}
                          _key={"applicantFirstNameMr"}
                          labelName={"applicantFirstNameMr"}
                          fieldName={"applicantFirstNameMr"}
                          updateFieldName={"applicantFirstName"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          label={<FormattedLabel id="firstNamemr" required />}
                          error={!!error.applicantFirstNameMr}
                          helperText={
                            error?.applicantFirstNameMr
                              ? error.applicantFirstNameMr.message
                              : null
                          }
                        />
                      </Grid>

                      {/*applicant middle name mr*/}
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <Transliteration
                          variant={"standard"}
                          _key={"applicantMiddleNameMr"}
                          labelName={"applicantMiddleNameMr"}
                          fieldName={"applicantMiddleNameMr"}
                          updateFieldName={"applicantMiddleName"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          label={<FormattedLabel id="middleNamemr" required />}
                          error={!!error.applicantMiddleNameMr}
                          helperText={
                            error?.applicantMiddleNameMr
                              ? error.applicantMiddleNameMr.message
                              : null
                          }
                        />
                      </Grid>
                      {/* applicant last name mr*/}
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <Transliteration
                          variant={"standard"}
                          _key={"applicantLastNameMr"}
                          labelName={"applicantLastNameMr"}
                          fieldName={"applicantLastNameMr"}
                          updateFieldName={"applicantLastName"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          label={<FormattedLabel id="lastNamemr" required />}
                          error={!!error.applicantLastNameMr}
                          helperText={
                            error?.applicantLastNameMr
                              ? error.applicantLastNameMr.message
                              : null
                          }
                        />
                      </Grid>
                    </>

                    {/* Applicant mobileNo */}
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <TextField
                        disabled={
                          router.query.pageMode == "view" ? true : false
                        }
                        inputProps={{ maxLength: 10, minLength: 10 }}
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        label={<FormattedLabel id="mobileNo" required />}
                        variant="standard"
                        {...register("applicantMobileNo")}
                        InputLabelProps={{
                          shrink:
                            router.query.id || watch("applicantMobileNo")
                              ? true
                              : false,
                        }}
                        error={!!error.applicantMobileNo}
                        helperText={
                          error?.applicantMobileNo
                            ? error.applicantMobileNo.message
                            : null
                        }
                      />
                    </Grid>
                    {/* Applicant aadharNo */}
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <TextField
                        disabled={
                          router.query.pageMode == "view" ? true : false
                        }
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        label={<FormattedLabel id="aadharNo" required />}
                        inputProps={{ maxLength: 12, minLength: 12 }}
                        variant="standard"
                        {...register("applicantAadharNo")}
                        InputLabelProps={{
                          shrink:
                            router.query.id || watch("applicantAadharNo")
                              ? true
                              : false,
                        }}
                        error={!!error.applicantAadharNo}
                        helperText={
                          error?.applicantAadharNo
                            ? error.applicantAadharNo.message
                            : null
                        }
                      />
                    </Grid>

                    {/* Applicant Upload Photos */}
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
                      <label>
                        <b>
                          <FormattedLabel id="husbandWifePhoto" required />
                        </b>
                      </label>
                      <UploadButton
                        appName="SLUM"
                        uploadDoc={docUpload}
                        setUploadDoc={setDocUpload}
                        serviceName="SLUM-IssuanceNoc"
                        filePath={(path) => {
                          handleUploadDocument(path);
                        }}
                        fileName={photo && photo.documentPath}
                      />
                    </Grid>
                  </Grid>

                  {/******* Additional Fields *********/}

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
                      <FormattedLabel id="additionalFields" />
                    </h2>
                  </Box> */}

                  {/* <Grid container spacing={2} sx={{ padding: "1rem" }}>
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <FormControl
                        error={!!error.asOnDate}
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      >
                        <Controller
                          control={control}
                          name="asOnDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    <FormattedLabel id="asOnDate" />
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) => {
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
                                  );
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    sx={{
                                      m: { xs: 0, md: 1 },
                                      minWidth: "100%",
                                    }}
                                    {...params}
                                    variant="standard"
                                    size="small"
                                    error={!!error.asOnDate}
                                    helperText={
                                      error?.asOnDate
                                        ? error?.asOnDate.message
                                        : null
                                    }
                                    InputLabelProps={{
                                      style: {
                                        fontSize: 12,
                                        marginTop: 3,
                                      },
                                    }}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                      </FormControl>
                    </Grid>

                    //No of copies
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <TextField
                        disabled={
                          router.query.pageMode == "view" ? true : false
                        }
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        type="number"
                        label={<FormattedLabel id="noOfCopies" required />}
                        variant="standard"
                        {...register("noOfCopies")}
                        InputLabelProps={{
                          shrink:
                            router.query.id || watch("noOfCopies")
                              ? true
                              : false,
                        }}
                        error={!!error.noOfCopies}
                        helperText={
                          error?.noOfCopies ? error.noOfCopies.message : null
                        }
                      />
                    </Grid>

                    //feesApplicable
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <TextField
                        disabled={
                          router.query.pageMode == "view" ? true : false
                        }
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        label={<FormattedLabel id="feesApplicable" />}
                        variant="standard"
                        {...register("feesApplicable")}
                        InputLabelProps={{
                          shrink:
                            router.query.id || watch("feesApplicable")
                              ? true
                              : false,
                        }}
                        error={!!error.feesApplicable}
                        helperText={
                          error?.feesApplicable
                            ? error.feesApplicable.message
                            : null
                        }
                      />
                    </Grid>
                  </Grid> */}

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
                  <Grid container>
                    <Grid container spacing={2} sx={{ padding: "1rem" }}>
                      {/* Slum taxes amount */}
                      <Grid
                        item
                        xl={7}
                        lg={7}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "left",
                          alignItems: "left",
                        }}
                      >
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
                        xl={4}
                        lg={4}
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
                          disabled={!isSlumTaxes}
                          onClick={handlePaymentButton}
                        >
                          <FormattedLabel id="payment" />
                        </Button>
                      </Grid>
                    </Grid>

                    {/*  water taxes amount  */}

                    {/* <Grid container spacing={2} sx={{ padding: "1rem" }}>
                      
                      <Grid
                        item
                        xl={7}
                        lg={7}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "left",
                          alignItems: "left",
                        }}
                      >
                        <TextField
                          disabled={!isWaterTaxes}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          label={<FormattedLabel id="waterTaxesAmount" />}
                          variant="standard"
                          value={watch("waterTaxesAmount")}
                          InputLabelProps={{
                            shrink:
                              watch("waterTaxesAmount") ||
                              watch("waterTaxesAmount") == 0
                                ? true
                                : false,
                          }}
                          error={!!error.waterTaxesAmount}
                          helperText={
                            error?.waterTaxesAmount
                              ? error.waterTaxesAmount.message
                              : null
                          }
                        />
                      </Grid>

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
                          marginTop: "10px",
                        }}
                      >
                        <Button
                          variant="contained"
                          size="small"
                          disabled={!isWaterTaxes}
                          onClick={handlePaymentButton}
                        >
                          <FormattedLabel id="payment" />
                        </Button>
                      </Grid>
                    </Grid> */}
                  </Grid>

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
                      <FormattedLabel id="generateDocuments" />
                    </h2>
                  </Box> */}

                  {/* <Grid container spacing={2} sx={{ padding: "1rem" }}> */}
                  {/* property taxes amount */}
                  {/* <Grid
                      item
                      xl={7}
                      lg={7}
                      md={6}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "left",
                        alignItems: "left",
                      }}
                    >
                      <label>
                        <b>
                          <FormattedLabel id="selfDeclarationForm" />
                        </b>
                      </label>
                    </Grid>

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
                      }}
                    >
                      {selfDeclarationFlag ? (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => {
                            if (hutOwnerData) {
                              setChoice("selfDeclaration");
                              handleOpen();
                            } else {
                              sweetAlert({
                                text:
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
                              setChoice("selfDeclaration");
                              handleOpen();
                            } else {
                              sweetAlert({
                                text:
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
                    </Grid> */}
                  {/* </Grid>  */}

                  {/* <Grid container spacing={2} sx={{ padding: "1rem" }}> */}
                  {/* water taxes amount */}
                  {/* <Grid
                      item
                      xl={7}
                      lg={7}
                      md={6}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "left",
                        alignItems: "left",
                      }}
                    >
                      <label>
                        <b>
                          <FormattedLabel id="selfAttestation" />
                        </b>
                      </label>
                    </Grid>

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
                      }}
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
                                text:
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
                                text:
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
                    </Grid> */}
                  {/* </Grid> */}

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
                          <FormattedLabel id="purposeForNoc" />
                        </h3>
                      </Grid>
                    </Grid>
                  </Box>

                  <Grid container spacing={2} sx={{ padding: "1rem" }}>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        label={<FormattedLabel id="purpose" required />}
                        variant="standard"
                        {...register("purpose")}
                        inputProps={{ maxLength: 1000 }}
                        InputLabelProps={{
                          shrink:
                            router.query.id || watch("purpose") ? true : false,
                        }}
                        multiline
                        error={!!error.purpose}
                        helperText={
                          error?.purpose ? error.purpose.message : null
                        }
                      />
                    </Grid>
                  </Grid>

                  {/* Buttons Row */}

                  <Grid container spacing={2} sx={{ padding: "1rem" }}>
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
                        color="primary"
                        variant="contained"
                        type="submit"
                        size="small"
                        name="draft"
                        disabled={!isOverDuePayment}
                        onClick={() => handleSaveAsDraft("draft")}
                        endIcon={<Save />}
                      >
                        <FormattedLabel id="saveAsDraft" />
                      </Button>
                    </Grid>
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
                        color="success"
                        variant="contained"
                        type="submit"
                        size="small"
                        disabled={
                          !isOverDuePayment ||
                          // (selfDeclarationFlag && selfAttestationFlag
                          //   ? false
                          //   : true) ||
                          !photo ||
                          !photo.documentPath
                        }
                        onClick={() => handleSaveAsDraft("save")}
                        endIcon={<Save />}
                      >
                        <FormattedLabel id="save" />
                      </Button>
                    </Grid>

                 
                  </Grid>
                </Grid>
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
                          hutData={selectedHutData}
                          handleClose={handleClose}
                          applicantPhoto={photo?.documentPath}
                          setSelfDeclarationFlag={setSelfDeclarationFlag}
                          selfDeclarationFlag={selfDeclarationFlag}
                        />
                      )}
                    {choice &&
                      choice === "selfAttestation" &&
                      selectedHutData && (
                        <SelfAttestation
                          hutOwnerData={hutOwnerData}
                          applicantPhoto={photo?.documentPath}
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
                              color="primary"
                              size="small"
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
