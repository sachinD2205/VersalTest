import React, { useEffect, useRef, useState } from "react";
import router from "next/router";
import {
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
  ThemeProvider,
  IconButton,
  Box,
  Grid,
  Modal,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import sweetAlert from "sweetalert";
import theme from "../../../../../theme";
import schema from "../../../../../containers/schema/slumManagementSchema/issuanceOfNocSchema";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import UploadButton from "../../../../../components/SlumBillingManagementSystem/FileUpload/UploadButton copy";
import { ExitToApp, Save } from "@mui/icons-material";
import axios from "axios";
import urls from "../../../../../URLS/urls";
import { useReactToPrint } from "react-to-print";
import Autocomplete from "@mui/material/Autocomplete";
import BreadcrumbComponent from "../../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";
import commonStyles from "../../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../../util/commonErrorUtil";

const Index = () => {
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });


  let loggedInUser = localStorage.getItem("loggedInUser");
  const language = useSelector((state) => state.labels.language);
  const user = useSelector((state) => state.user.user);
  const [photo, setPhoto] = useState();
  const [isSlumTaxes, setIsSlumTaxes] = useState(false);
  const [isOverDuePayment, setIsOverDuePayment] = useState(false);
  const [hutOptions, setHutOptions] = useState([]);
  const [pendingBillData, setPendingBillData] = useState({});
  const [hutNo, setHutNo] = useState("");
  const [hutKey, setHutKey] = useState("");
  const [selectedHutData, setSelectedHutData] = useState({});
  const [hutOwnerData, setHutOwnerData] = useState({});
  const [hutKeyVal, setHutKeyVal] = useState();
  const [nocData, setNocData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [choice, setChoice] = useState("");
  const [slumDropDown, setSlumDropDown] = useState([]);
  const [areaDropDown, setAreaDropDown] = useState([]);
  const [villageDropDown, setVillageDropDown] = useState([]);
  const [titleDropDown, setTitleDropDown] = useState([]);
  const [docList, setDocList] = useState([]);
  const [requiredUploadDoc, setRequiredUploadDoc] = useState(null);
  const [requiredUploadDoc1, setRequiredUploadDoc1] = useState(null);
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
  useEffect(() => {
    if (router.query.id) {
      getNocApplicationDataById(router.query.id);
    }
  }, [router.query.id]);

  const getNocApplicationDataById = (id) => {
    axios
      .get(`${urls.SLUMURL}/trnIssueNoc/getById?id=${id}`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data;
        setNocData(result);
        fetchDataOnUI(r.data);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };

  useEffect(() => {
    let res = nocData;
    setValue("noOfCopies", res?.noOfCopies ? res?.noOfCopies : "");
    setValue("purpose", res?.purpose ? res?.purpose : "");
    setValue("applicantTitle", res?.applicantTitle ? res?.applicantTitle : "-");
    setValue(
      "applicantFirstName",
      res?.applicantFirstName ? res?.applicantFirstName : "-"
    );
    setValue(
      "applicantFirstNameMr",
      res?.applicantFirstNameMr ? res?.applicantFirstNameMr : "-"
    );
    setValue(
      "applicantMiddleName",
      res?.applicantMiddleName ? res?.applicantMiddleName : "-"
    );
    setValue(
      "applicantMiddleNameMr",
      res?.applicantMiddleNameMr ? res?.applicantMiddleNameMr : "-"
    );
    setValue(
      "applicantLastName",
      res?.applicantLastName ? res?.applicantLastName : "-"
    );
    setValue(
      "applicantLastNameMr",
      res?.applicantLastNameMr ? res?.applicantLastNameMr : "-"
    );
    setValue(
      "applicantMobileNo",
      res?.applicantMobileNo ? res?.applicantMobileNo : "-"
    );
    setValue(
      "applicantAadharNo",
      res?.applicantAadharNo ? res?.applicantAadharNo : "-"
    );
    setValue("asOnDate", res?.asOnDate ? res?.asOnDate : "-");
    handleUploadDocument(res?.applicantPhoto);
  }, [nocData]);

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
    if (selectedHutData != null) {
      setDataOnUI();
    }
  }, [selectedHutData, hutOwnerData, language]);

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
      !hutOwner?.firstName
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
      language == "en" ? temp_slumKey?.slumEn : temp_slumKey?.slumMr
    );
  };


  useEffect(() => {
    getSlumData();
    getAreaData();
    getVillageData();
    getHutData();
    getTitleData();
    getServiceCharges();
    getRequiredDocs();
  }, []);

  const getServiceCharges = () => {
    axios
      .get(
        `${urls.CFCURL}/master/servicecharges/getByServiceId?serviceId=129`,
        {
          headers: headers,
        }
      )
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
      getHutData(hutNo);
    }
  }, [hutNo]);

  useEffect(() => {
    if (hutKeyVal != null && hutKeyVal != undefined) {
      getHutOwnerDetailsByHutKey();
    }
  }, [hutKeyVal]);

  const getHutOwnerDetailsByHutKey = () => {
    axios
      .get(`${urls.SLUMURL}/mstHut/getById?id=${hutKeyVal}`, {
        headers: headers,
      })
      .then((r) => {
        setIsLoading(false);
        setHutNo(r.data.hutNo);
        setValue("pincode", r.data.pincode);
        setValue(
          "slumKey",
          language == "en"
            ? slumDropDown &&
                slumDropDown.find((obj) => obj.id == r.data.slumKey)?.slumEn
            : slumDropDown &&
                slumDropDown.find((obj) => obj.id == r.data.slumKey)?.slumMr
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
        setValue(
          "ownerMobileNo",
          hutOwner?.mobileNo ? hutOwner?.mobileNo : "-"
        );
        setValue(
          "ownerAadharNo",
          hutOwner?.aadharNo ? hutOwner?.aadharNo : "-"
        );
        setValue("ownerEmailId", hutOwner?.emailId ? hutOwner?.emailId : "-");
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };

  const getOutstandingTaxes = () => {
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
          setPendingBillData(temp);
          if (temp?.balanceAmount > 0) {
            setIsSlumTaxes(true);
            setValue("slumTaxesAmount", temp?.balanceAmount);
          } else {
            setIsSlumTaxes(false);
          }
        })
        .catch((err) => {
          if (err) {
            setIsOverDuePayment(true);
          }
        });
  };

  const fetchDataOnUI = (data) => {
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
    setHutKeyVal(data?.hutKey);
    setValue("asOnDate", data.asOnDate);
    setValue("clerkApprovalRemark", data.clerkApprovalRemark);

    const extractedData = data.transactionDocumentsList.map(
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
  };

  const handleUploadDocument = (path) => {
    let temp = {
      documentPath: path,
      documentKey: 1,
      documentType: "",
      remark: "",
    };
    setPhoto(temp);
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
              titleEn: r.title,
              titleMr: r.titleMr,
            };
          });
        setTitleDropDown(res);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };
  const getHutData = (selectedId) => {
    setIsLoading(true);
    axios
      .get(`${urls.SLUMURL}/mstHut/getAll`, {
        headers: headers,
      })
      .then((r) => {
        setIsLoading(false);
        let result = r.data.mstHutList;

        let selectedHut =
          result && result.find((obj) => obj.hutNo == selectedId);

        let hutOwner =
          selectedHut &&
          selectedHut.mstHutMembersList.find((obj) => obj.headOfFamily === "Y");

        const hutNumbers = result.map((hut) => hut.hutNo);
        setHutOptions(hutNumbers);
        setHutOwnerData(hutOwner);
        setHutKey(selectedHut?.id);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
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
            documentPath: path,
            documentType: typeOfDocument,
          };
        } else {
          return each;
        }
      });
    setDocList(res);
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
        setHutKey(result[0].id);
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
        let result = r.data.mstSlumList;
        let res =
          result &&
          result.map((r) => {
            return {
              id: r.id,
              slumEn: r.slumName,
              slumMr: r.slumNameMr,
            };
          });
        let temp = res && res.find((obj) => obj.id == selectedHutData?.slumKey);

        setValue(
          "slumKey",
          !temp ? "-" : language == "en" ? temp?.slumEn : temp?.slumMr
        );
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

  const handleOnSubmit = (formData) => {
    setIsLoading(true);
    let body = {
      activeFlag: "Y",
      ...nocData,
      slumKey: selectedHutData?.slumKey,
      hutNo: formData?.hutNo === null ? hutNo : formData?.hutNo,
      hutKey: hutKey,
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
      areaKey: nocData?.areaKey,
      villageKey: nocData?.villageKey,
      pincode: nocData?.pincode,
      lattitude: nocData?.lattitude,
      longitude: nocData?.longitude,
      outstandingTax: null,
      remarks: "test",
      isApproved: null,
      isComplete: null,
      applicationNo: nocData?.applicationNo,
      id: nocData?.id,
      status: nocData?.status,
      activeFlag: nocData?.activeFlag,
      purpose: formData?.purpose,
      transactionDocumentsList: docList,
    };

    const tempData = axios
      .post(`${urls.SLUMURL}/trnIssueNoc/save`, body, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          sweetAlert({
            title: language == "en" ? "Updated!" : "अद्यतनित केले",
            text:
              language == "en"
                ? "Issuance of Noc Updated successfully !"
                : "एनओसी जारी करणे यशस्वीरित्या अद्यतनित केले!",
            icon: "success",
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
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
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
          setIsOverDuePayment(false);
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
        setIsOverDuePayment(true);
      });
  };

  const catchMethod = (err) => {
    if (err.message === "Network Error") {
      sweetAlert(
        language == "en" ? "Network Error" : "नेटवर्क त्रुटी !",
        language == "en"
          ? "Server is unreachable or may be a network issue, please try after sometime"
          : "सर्व्हर पोहोचण्यायोग्य नाही किंवा नेटवर्क समस्या असू शकते, कृपया काही वेळानंतर प्रयत्न करा",
        "error"
      );
    } else if (err.message === "Request failed with status code 404") {
      sweetAlert(
        language == "en" ? "Bad Request" : "वाईट विनंती !",
        language == "en" ? "Unauthorized access !" : "अनधिकृत पोहोच !!",
        "error"
      );
    } else {
      sweetAlert(
        language == "en" ? "Error" : "त्रुटी !",
        language == "en" ? "Something went to wrong !" : "काहीतरी चूक झाली!",
        "error"
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
                  disabled={router.query.pageMode == "view" ? true : false}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="title" required />}
                  variant="standard"
                  value={watch("ownerTitle")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("ownerTitle") ? true : false,
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
                  disabled={router.query.pageMode == "view" ? true : false}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="firstName" required />}
                  variant="standard"
                  value={watch("ownerFirstName")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("ownerFirstName") ? true : false,
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
                  disabled={router.query.pageMode == "view" ? true : false}
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
                  disabled={router.query.pageMode == "view" ? true : false}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="lastName" required />}
                  variant="standard"
                  value={watch("ownerLastName")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("ownerLastName") ? true : false,
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
                  disabled={router.query.pageMode == "view" ? true : false}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="mobileNo" required />}
                  variant="standard"
                  value={watch("ownerMobileNo")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("ownerMobileNo") ? true : false,
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
                  disabled={router.query.pageMode == "view" ? true : false}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="aadharNo" required />}
                  variant="standard"
                  value={watch("ownerAadharNo")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("ownerAadharNo") ? true : false,
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
                  disabled={router.query.pageMode == "view" ? true : false}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="slumName" required />}
                  variant="standard"
                  value={watch("slumKey")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("slumKey") ? true : false,
                  }}
                  error={!!error.slumKey}
                  helperText={error?.slumKey ? error.slumKey.message : null}
                />
              </Grid>

              {/* Area */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={router.query.pageMode == "view" ? true : false}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="area" required />}
                  variant="standard"
                  value={watch("areaKey")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("areaKey") ? true : false,
                  }}
                  error={!!error.areaKey}
                  helperText={error?.areaKey ? error.areaKey.message : null}
                />
              </Grid>

              {/* Village */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={router.query.pageMode == "view" ? true : false}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="village" required />}
                  variant="standard"
                  value={watch("villageKey")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("villageKey") ? true : false,
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
                  disabled={router.query.pageMode == "view" ? true : false}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="pincode" required />}
                  variant="standard"
                  value={watch("pincode")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("pincode") ? true : false,
                  }}
                  error={!!error.pincode}
                  helperText={error?.pincode ? error.pincode.message : null}
                />
              </Grid>

              {/* Lattitude */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={router.query.pageMode == "view" ? true : false}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="lattitude" required />}
                  variant="standard"
                  value={watch("lattitude")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("lattitude") ? true : false,
                  }}
                  error={!!error.lattitude}
                  helperText={error?.lattitude ? error.lattitude.message : null}
                />
              </Grid>

              {/* Longitude */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={router.query.pageMode == "view" ? true : false}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="longitude" required />}
                  variant="standard"
                  value={watch("longitude")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("longitude") ? true : false,
                  }}
                  error={!!error.longitude}
                  helperText={error?.longitude ? error.longitude.message : null}
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
                  disabled={router.query.pageMode == "view" ? true : false}
                  variant="standard"
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  error={!!error.applicantTitle}
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

              {/* Applicant firstName (English) */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={router.query.pageMode == "view" ? true : false}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="firstNameEn" required />}
                  variant="standard"
                  {...register("applicantFirstName")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("applicantFirstName")
                        ? true
                        : false,
                  }}
                  error={!!error.applicantFirstName}
                  helperText={
                    error?.applicantFirstName
                      ? error.applicantFirstName.message
                      : null
                  }
                />
              </Grid>

              {/* Applicant firstName (Marathi) */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={router.query.pageMode == "view" ? true : false}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="firstNamemr" required />}
                  variant="standard"
                  {...register("applicantFirstNameMr")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("applicantFirstNameMr")
                        ? true
                        : false,
                  }}
                  error={!!error.applicantFirstNameMr}
                  helperText={
                    error?.applicantFirstNameMr
                      ? error.applicantFirstNameMr.message
                      : null
                  }
                />
              </Grid>

              {/* Applicant middleName (English) */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={router.query.pageMode == "view" ? true : false}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="middleNameEn" required />}
                  variant="standard"
                  {...register("applicantMiddleName")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("applicantMiddleName")
                        ? true
                        : false,
                  }}
                  error={!!error.applicantMiddleName}
                  helperText={
                    error?.applicantMiddleName
                      ? error.applicantMiddleName.message
                      : null
                  }
                />
              </Grid>

              {/* Applicant middleName (Marathi) */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={router.query.pageMode == "view" ? true : false}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="middleNamemr" required />}
                  variant="standard"
                  {...register("applicantMiddleNameMr")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("applicantMiddleNameMr")
                        ? true
                        : false,
                  }}
                  error={!!error.applicantMiddleNameMr}
                  helperText={
                    error?.applicantMiddleNameMr
                      ? error.applicantMiddleNameMr.message
                      : null
                  }
                />
              </Grid>

              {/* Applicant lastName (English) */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={router.query.pageMode == "view" ? true : false}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="lastNameEn" required />}
                  variant="standard"
                  {...register("applicantLastName")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("applicantLastName")
                        ? true
                        : false,
                  }}
                  error={!!error.applicantLastName}
                  helperText={
                    error?.applicantLastName
                      ? error.applicantLastName.message
                      : null
                  }
                />
              </Grid>

              {/* Applicant lastName (Marathi) */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={router.query.pageMode == "view" ? true : false}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="lastNamemr" required />}
                  variant="standard"
                  {...register("applicantLastNameMr")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("applicantLastNameMr")
                        ? true
                        : false,
                  }}
                  error={!!error.applicantLastNameMr}
                  helperText={
                    error?.applicantLastNameMr
                      ? error.applicantLastNameMr.message
                      : null
                  }
                />
              </Grid>

              {/* Applicant mobileNo */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={router.query.pageMode == "view" ? true : false}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  inputProps={{ maxLength: 10, minLength: 10 }}
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
                  disabled={router.query.pageMode == "view" ? true : false}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  inputProps={{ maxLength: 12, minLength: 12 }}
                  label={<FormattedLabel id="aadharNo" required />}
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
                    <FormattedLabel id="photo" required />
                  </b>
                </label>
                <UploadButton
                  appName="SLUM"
                  serviceName="SLUM-IssuanceNoc"
                  filePath={(path) => {
                    handleUploadDocument(path);
                  }}
                  fileName={photo && photo.documentPath}
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
                    <FormattedLabel id="outstandingTaxesAmount" />
                  </h3>
                </Grid>
              </Grid>
            </Box>

            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              {/* Slum taxes amount */}
              <Grid item xl={7} lg={7} md={6} sm={6} xs={12}>
                <TextField
                  disabled={!isSlumTaxes}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="slumTaxesAmount" />}
                  variant="standard"
                  value={watch("slumTaxesAmount")}
                  InputLabelProps={{
                    shrink:
                      watch("slumTaxesAmount") || watch("slumTaxesAmount") == 0
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
                  <FormattedLabel id='payment'/>
                </Button>
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

              {docList?.length != 0 && (
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
                    rowsPerPageOptions={[5]}
                  />
                </Grid>
              )}
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
                  multiline
                  {...register("purpose")}
                  inputProps={{ maxLength: 1000 }}
                  InputLabelProps={{
                    shrink: router.query.id || watch("purpose") ? true : false,
                  }}
                  error={!!error.purpose}
                  helperText={error?.purpose ? error.purpose.message : null}
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
                    <FormattedLabel id="approvalSection" />
                  </h3>
                </Grid>
              </Grid>
            </Box>
            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="clearkRemarks" />}
                  variant="standard"
                  disabled={true}
                  {...register("clerkApprovalRemark")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{ maxLength: 500 }}
                  multiline
                  error={!!error.clerkApprovalRemark}
                  helperText={
                    error?.clerkApprovalRemark
                      ? error.clerkApprovalRemark.message
                      : null
                  }
                />
              </Grid>
            </Grid>

            {/* Buttons Row */}
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
                  marginTop: "10px",
                }}
              >
                <Button
                  color="success"
                  variant="contained"
                  size="small"
                  type="submit"
                  disabled={
                    !isOverDuePayment ||
                    !photo ||
                    !photo.documentPath
                  }
                  endIcon={<Save />}
                >
                  <FormattedLabel id="update" />
                </Button>
              </Grid>

            
            </Grid>   
          </form>
        </Paper>
      </ThemeProvider>
    </>
  );
};

export default Index;
