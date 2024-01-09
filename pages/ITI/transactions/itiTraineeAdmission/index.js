import { EyeFilled } from "@ant-design/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import PrintIcon from "@mui/icons-material/Print";

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
  Slide,
  TextField,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Divider } from "antd";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import schoolLabels from "../../../../containers/reuseableComponents/labels/modules/schoolLabels";
import {
  itiTraineeAdmissionSchema,
  principalOrDocsClerkSchema,
  accountantSchema,
} from "../../../../containers/schema/iti/transactions/itiTraineeAdmissionSchema";
import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css";
import UploadButton from "../fileUpload/UploadButton";
import { useReactToPrint } from "react-to-print";
import AdmissionConfirmationSlipToPrint from "../../../../components/school/admissionConfirmationSlipToPrint";
// import UploadButton from "../../../school/transaction/fileUpload/UploadButton";
import DocumentsUpload from "../../../../components/school/documentsUploadVishal";
import Loader from "../../../../containers/Layout/components/Loader";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import DocumentsUploadIti from "../../../../components/iti/fileUploadEncryptDecrypt";

const Index = (props) => {
  const [dataValidation, setDataValidation] = useState(
    itiTraineeAdmissionSchema
  );
  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   methods,
  //   reset,
  //   setValue,
  //   watch,
  //   formState: { errors },
  // } = useForm({
  //   criteriaMode: "all",
  //   resolver: yupResolver(dataValidation),
  //   mode: "onChange",
  // });

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(dataValidation),
    mode: "onChange",
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = methods;
  const [loading, setLoading] = useState(false);

  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [buttonInputState, setButtonInputState] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [id, setID] = useState();
  const [isReassignByDocVer, setIsReassignByDocVer] = useState(false);
  const [isReassignByPrincipal, setIsReassignByPrincipal] = useState(false);

  const [fetchData, setFetchData] = useState(null);
  const [religions, setReligions] = useState([]);
  const [castCategoryNames, setCastCategoryNames] = useState([]);
  const [castNames, setCastNames] = useState([]);
  // const [subCastNames, setSubCastNames] = useState([]);

  const [citizenshipList] = useState([
    { id: 1, citizen: "Indian" },
    { id: 2, citizen: "Other" },
  ]);
  const [motherTongueList] = useState([
    { id: 1, motherTongue: "English" },
    { id: 2, motherTongue: "Marathi" },
    { id: 3, motherTongue: "Hindi" },
    { id: 4, motherTongue: "Other" },
  ]);
  const [isFeesSection, setIsFeesSection] = useState(false);
  const [locatedAt, setLocatedAt] = useState([]);
  const [gendersList] = useState([
    { id: 1, gender: "Male", value: "M" },
    { id: 2, gender: "Female", value: "F" },
    { id: 3, gender: "Other", value: "O" },
  ]);

  const [readonlyFields, setReadonlyFields] = useState(false);
  const [rejectApplViewBtn, setRejectApplViewBtn] = useState(false);
  const [docView, setDocView] = useState(false);

  const [traineePhotograph, setTraineePhotograph] = useState();
  const [traineeAadharCardDocument, setTraineeAadharCardDocument] = useState();
  const [castCertificate, setCastCertificate] = useState();
  const [leavingCertificateDocument, setLeavingCertificateDocument] =
    useState();
  const [lastYearMarksheet, setLastYearMarksheet] = useState();
  const [dvetAllotmentLetter, setDvetAllotmentLetter] = useState();
  // docs for obc,sc, st students
  const [incomeProof, setIncomeProof] = useState();
  const [nonCreamylayer, setNonCreamylayer] = useState();

  const [recieptData, setRecieptData] = useState();
  const [isReady, setIsReady] = useState();

  const [showTable, setShowTable] = useState(true);
  const router = useRouter();

  // -------------------------------------------------------------------------
  const [encrptTraineePhotograph, setEncrptTraineePhotograph] = useState(null);
  const [encrptTraineeAadhar, setEncrptTraineeAadhar] = useState(null);
  const [encrptCastCert, setEncrptCastCert] = useState(null);
  const [encrptTraineeLC, setEncrptTraineeLC] = useState(null);
  const [encrptTraineeLastYrMarksheet, setEncrptTraineeLastYrMarksheet] =
    useState(null);
  const [encrptDvetAllotmentLetter, setEncrptDvetAllotmentLetter] =
    useState(null);
  const [encrptIncomeProof, setEncrptIncomeProof] = useState(null);
  const [encrptNonCreamylayer, setEncrptNonCreamylayer] = useState(null);
  // -------------------------------------------------------------------------

  // --------------------Getting logged in authority roles -----------------------

  const [authority, setAuthority] = useState([]);
  let user = useSelector((state) => state.user.user);
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");

  useEffect(() => {
    let auth = user?.menus?.find((r) => {
      if (r.id == selectedMenuFromDrawer) {
        return r;
      }
    })?.roles;
    setAuthority(auth);
  }, []);
  useEffect(() => {
    console.log("authority", authority);
  }, [authority]);
  // ---------------------------------------------------------------------------------

  const language = useSelector((state) => state?.labels?.language);
  const [labels, setLabels] = useState(schoolLabels[language ?? "en"]);
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const userToken = useGetToken();

  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
        setCatchMethodStatus(false);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };
  //for calculate the age of the student based on their DoB selection
  const dob = watch("studentDateOfBirth");
  useEffect(() => {
    if (dob) {
      const today = new Date();
      const birthDate = new Date(dob);
      const age = today.getFullYear() - birthDate.getFullYear();
      setValue("studentAge", age);
    }
  }, [dob, setValue]);
  // -----------------------------------------------------------------------------------
  const casteCategoryForDocs = watch("casteCategoryKey");

  useEffect(() => {
    setLabels(schoolLabels[language ?? "en"]);
  }, [setLabels, language]);

  // -----------------------------------------------------------------------------------
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });
  useEffect(() => {
    if (recieptData && showTable === true) {
      handlePrint();
    }
  }, [recieptData]);
  // -----------------------------------------------------------------------------------
  const [itiKeys, setItiKeys] = useState([]);
  const [academicYearList, setAcademicYearList] = useState([]);
  const [tradeKeys, setTradeKeys] = useState([]);
  const [stateKeys, setStateKeys] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);

  useEffect(() => {
    console.log("dataValidation", dataValidation?.fields);
  }, [dataValidation]);

  // useEffect(() => {
  //   setValue("traineePhotograph", traineePhotograph);
  //   setValue("traineeAadharCardDocument", traineeAadharCardDocument);
  //   setValue("leavingCertificateDocument", leavingCertificateDocument);
  //   setValue("lastYearMarksheet", lastYearMarksheet);
  //   setValue("dvetAllotmentLetter", dvetAllotmentLetter);
  //   // console.log("ValidationtraineePhotograph", watch("traineePhotograph"));
  // }, [
  //   traineePhotograph,
  //   traineeAadharCardDocument,
  //   leavingCertificateDocument,
  //   lastYearMarksheet,
  //   dvetAllotmentLetter,
  // ]);

  useEffect(() => {
    console.log("traineeDateOfBirth", watch("traineeDateOfBirth"));
  }, [watch("traineeDateOfBirth")]);

  //   get ITI Names
  const getItiKeys = () => {
    // axios.get(`${urls.SCHOOL}/mstIti/getAll`).then((r) => {
    axios
      .get(`${urls.SCHOOL}/mstIti/getItiOnUserId?userId=${user?.id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setItiKeys(
          r?.data?.map((data) => ({
            id: data?.id,
            itiName: data?.itiName,
            itiType: data?.itiType,
            itiCode: data?.itiCode,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // get academic year
  const getAcademicYearList = () => {
    axios
      .get(`${urls.SCHOOL}/mstAcademicYear/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        // console.log("AY", r.data.mstAcademicYearList);
        setAcademicYearList(
          r.data.mstAcademicYearList.map((row) => ({
            id: row.id,
            academicYear: row.academicYear,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // getPaymentType
  const getPaymentType = () => {
    axios
      .get(`${urls.CFCURL}/master/paymentType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setPaymentTypes(
          r?.data?.paymentType?.map((row) => ({
            id: row.id,
            paymentType: row.paymentType,
            paymentTypeMr: row.paymentTypeMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // getLocatedAt
  const getLocatedAt = () => {
    axios
      .get(`${urls.SCHOOL}/mstItIFees/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setLocatedAt(
          r?.data?.mstItIFeesDao?.map((obj) => ({
            id: obj.id,
            locatedAt: obj.locatedAt,
            fees: obj.fees,
            deposit: obj.deposit,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    getAcademicYearList();
    getItiKeys();
    getPaymentType();
    getLocatedAt();
  }, []);

  // getPaymentMode
  let paymentType = watch("paymentTypeKey");
  const getPaymentMode = () => {
    if (paymentType)
      axios
        .get(
          `${urls.CFCURL}/master/paymentMode/getAllByPaymentType?paymentType=${paymentType}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          setPaymentModes(
            r?.data?.paymentMode?.map((row) => ({
              id: row.id,
              paymentMode: row.paymentMode,
              paymentModeMr: row.paymentModeMr,
            }))
          );
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
  };
  useEffect(() => {
    getPaymentMode();
  }, [paymentType]);

  let allotedItiId = watch("itiAllocatedKey");
  //   get  trades
  const getAllTradeKeys = () => {
    if (allotedItiId) {
      axios
        .get(
          `${urls.SCHOOL}/mstItiTrade/getDataOnItiKey?itiKey=${allotedItiId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          setTradeKeys(
            r?.data?.map((data) => ({
              ...data,
            }))
          );
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };
  useEffect(() => {
    getAllTradeKeys();
  }, [allotedItiId]);

  // -----------------------------------------------------------------------------------

  // getReligion
  const getReligions = () => {
    axios
      .get(`${urls.CFCURL}/master/religion/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setReligions(
          r.data.religion.map((row) => ({
            id: row.id,
            religion: row.religion,
            religionMr: row.religionMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  // getCastCategoryNames
  const getCastCategoryNames = () => {
    axios
      .get(`${urls.CFCURL}/castCategory/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        // console.log("castCategory/getAll", r);
        setCastCategoryNames(
          r?.data?.castCategory?.map((row) => ({
            id: row.id,
            castCategory: row.castCategory,
            castCategoryMr: row.castCategoryMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  // getCastNames
  let casteCategoryKey = watch("casteCategoryKey");
  const getCastNames = () => {
    if (casteCategoryKey) {
      // axios.get(`${urls.BaseURL}/cast/getAll`).then((r) => {
      axios
        .get(
          `${urls.BaseURL}/cast/getCastByCastCategory?casteCategoryId=${casteCategoryKey}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          setCastNames(
            r.data.mCast.map((row) => ({
              id: row.id,
              cast: row.cast,
              castMr: row.castMr,
            }))
          );
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

  // getStateKeys
  const getStateKeys = () => {
    axios
      .get(`${urls.SCHOOL}/mstState/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setStateKeys(
          r?.data?.mstStateDao?.map((row) => ({
            id: row.id,
            stateName: row.stateName,
            stateNameMr: row.stateNameMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    getCastCategoryNames();
    getStateKeys();
    getReligions();
    // getSubCastNames();
  }, []);

  useEffect(() => {
    getCastNames();
  }, [watch("casteCategoryKey")]);

  useEffect(() => {
    getItiStudentAdmission();
  }, [fetchData]);

  // reset docs after save/cancell/edit
  const docsReset = () => {
    setTraineePhotograph(""),
      setTraineeAadharCardDocument(""),
      setCastCertificate(""),
      setLeavingCertificateDocument(""),
      setLastYearMarksheet(""),
      setDvetAllotmentLetter("");
    setNonCreamylayer("");
    setIncomeProof("");
  };
  // get documents for edit and view buttons
  const getDocuments = (paramData) => {
    setTraineePhotograph(paramData?.traineePhotograph),
      setTraineeAadharCardDocument(paramData?.traineeAadharCardDocument),
      setCastCertificate(paramData?.castCertificate),
      setLeavingCertificateDocument(paramData?.leavingCertificateDocument),
      setLastYearMarksheet(paramData?.lastYearMarksheet),
      setDvetAllotmentLetter(paramData?.dvetAllotmentLetter);
    setNonCreamylayer(paramData?.nonCreamylayer);
    setIncomeProof(paramData?.incomeProof);
  };

  // set final action --> (approve or reassign) based on the docs verification action for docs verification clerk login
  useEffect(() => {
    if (btnSaveText === "StatusByDocsVerificationClerk") {
      if (
        watch("traineePhotographDocStatus") === "REASSAIGN" ||
        watch("traineeAadharCardDocStatus") === "REASSAIGN" ||
        watch("castCertificateDocStatus") === "REASSAIGN" ||
        watch("leavingCertificateDocStatus") === "REASSAIGN" ||
        watch("lastYearMarksheetDocStatus") === "REASSAIGN" ||
        watch("dvetAllotmentLetterDocStatus") === "REASSAIGN" ||
        watch("nonCreamylayerDocStatus") === "REASSAIGN" ||
        watch("incomeProofDocStatus") === "REASSAIGN"
      ) {
        setValue("action", "REASSAIGN");
      } else {
        setValue("action", "APPROVE");
      }
    }
  }, [
    btnSaveText,
    watch("traineePhotographDocStatus"),
    watch("traineeAadharCardDocStatus"),
    watch("castCertificateDocStatus"),
    watch("leavingCertificateDocStatus"),
    watch("lastYearMarksheetDocStatus"),
    watch("dvetAllotmentLetterDocStatus"),
    watch("nonCreamylayerDocStatus"),
    watch("incomeProofDocStatus"),
  ]);

  useEffect(() => {
    if (isFeesSection === true) {
      let _fees = locatedAt?.find(
        (item) => item?.id == watch("locatedAt")
      )?.fees;
      let _deposit = locatedAt?.find(
        (item) => item?.id == watch("locatedAt")
      )?.deposit;
      let _totalFees = _fees + _deposit;
      setValue("admissionFees", _fees);
      setValue("deposit", _deposit);
      setValue("totalAdmissionFeeRs", _totalFees);
    }
  }, [isFeesSection]);

  useEffect(() => {
    if (isFeesSection === true) {
      let totalFees = watch("totalAdmissionFeeRs");
      let paybleFees = watch("admissionFeeAmountToPay");
      let remainFees = totalFees - paybleFees;
      if (remainFees <= "0") {
        setValue("remainingFeesAmount", 0);
      }
      setValue("remainingFeesAmount", remainFees);
    }
  }, [watch("admissionFeeAmountToPay"), isFeesSection]);

  // Get Table - Data
  const getItiStudentAdmission = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    // console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    setLoading(true);
    axios
      .get(
        `${urls.SCHOOL}/trnItiTraineeAdmissionForm/getAllUserId?userId=${user?.id}`,
        {
          params: {
            pageSize: _pageSize,
            pageNo: _pageNo,
            sortBy: _sortBy,
            sortDir: _sortDir,
          },
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((r) => {
        let result = r.data.trnItiTraineeAdmissionFormList;
        // console.log("trnItiTraineeAdmissionFormList", result);
        let page = r?.data?.pageSize * r?.data?.pageNo;

        let _res = result.map((r, i) => {
          return {
            ...r,
            activeFlag: r.activeFlag,
            srNo: i + 1 + page,

            traineeName: `${r.traineeFirstName} ${r.traineeMiddleName} ${r.traineeLastName}`,

            // id: r.id,
            // itiKey: r.itiKey,
            // academicYearKey: r.academicYearKey,
            // itiName: r.itiName,

            // admissionRegistrationNo: r.admissionRegistrationNo,
            // applicationStatus: r.applicationStatus,

            // // persional details

            // traineeFirstName: r.traineeFirstName,
            // traineeMiddleName: r.traineeMiddleName,
            // traineeLastName: r.traineeLastName,

            // fatherFirstName: r.fatherFirstName,
            // fatherMiddleName: r.fatherMiddleName,
            // fatherLastName: r.fatherLastName,
            // motherFirstName: r.motherFirstName,
            // gender: r.gender,
            // parentMobileNumber: r.parentMobileNumber,
            // traineeMobileNumber: r.traineeMobileNumber,
            // traineeEmailId: r.traineeEmailId,
            // traineeAadharNumber: r.traineeAadharNumber,

            // // other details

            // casteCategoryKey: r.casteCategoryKey,
            // casteKey: r.casteKey,
            // casteName: r.casteName,
            // religionKey: r.religionKey,
            // religionName: r.religionName,
            // // citizenshipKey: r.citizenshipKey,
            // citizenshipName: r.citizenshipName,
            // // motherTongueKey: r.motherTongueKey,
            // motherTongueName: r.motherTongueName, //motherTongueName
            // address: r.address,
            // locatedAt: r.locatedAt,
            // area: r.area,
            // districtName: r.districtName,
            // stateKey: r.stateKey,
            // pincode: r.pincode,

            // traineeDateOfBirth: r.traineeDateOfBirth,
            // traineeBirthPlace: r.traineeBirthPlace,

            // // allotement details
            // allotmentRound: r.allotmentRound,
            // preferenceNumber: r.preferenceNumber,
            // allotmentCategory: r.allotmentCategory,
            // mcode: r.mcode,
            // itiAllocatedKey: r.itiAllocatedKey,
            // itiNameAllocated: r.itiNameAllocated,
            // itiCodeAllocated: r.itiCodeAllocated,
            // itiTradeKey: r.itiTradeKey,
            // itiTradeName: r.itiTradeName,

            // // last school details

            // lastSchoolName: r.lastSchoolName,
            // lastSchoolAdmissionDate: r.lastSchoolAdmissionDate,
            // lastSchoolLeavingDate: r.lastSchoolLeavingDate,
            // lastSchoolLeavingReason: r.lastSchoolLeavingReason,
            // studentBehaviour: r.studentBehaviour,
            // lastClass: r.lastClass,

            // // documents

            // traineePhotograph: r.traineePhotograph,
            // traineeAadharCardDocument: r.traineeAadharCardDocument,
            // castCertificate: r.castCertificate,
            // leavingCertificateDocument: r.leavingCertificateDocument,
            // lastYearMarksheet: r.lastYearMarksheet,
            // dvetAllotmentLetter: r.dvetAllotmentLetter,
            // nonCreamylayer: r.nonCreamylayer,
            // incomeProof: r.incomeProof,

            // traineePhotographDocStatus: r.traineePhotographDocStatus,
            // traineePhotographDocRemark: r.traineePhotographDocRemark,
            // traineeAadharCardDocStatus: r.traineeAadharCardDocStatus,
            // traineeAadharCardDocRemark: r.traineeAadharCardDocRemark,
            // castCertificateDocStatus: r.castCertificateDocStatus,
            // castCertificateDocRemark: r.castCertificateDocRemark,
            // leavingCertificateDocStatus: r.leavingCertificateDocStatus,
            // leavingCertificateDocRemark: r.leavingCertificateDocRemark,
            // lastYearMarksheetDocStatus: r.lastYearMarksheetDocStatus,
            // lastYearMarksheetDocRemark: r.lastYearMarksheetDocRemark,
            // dvetAllotmentLetterDocStatus: r.dvetAllotmentLetterDocStatus,
            // dvetAllotmentLetterDocRemark: r.dvetAllotmentLetterDocRemark,

            // nonCreamylayerDocStatus: r.nonCreamylayerDocStatus,
            // nonCreamylayerDocRemark: r.nonCreamylayerDocRemark,
            // incomeProofDocStatus: r.incomeProofDocStatus,
            // incomeProofDocRemark: r.incomeProofDocRemark,

            // totalAdmissionFeeRs: r.totalAdmissionFeeRs,
            // admissionFeeAmountToPay: r.admissionFeeAmountToPay,
            // paymentTypeKey: r.paymentTypeKey,
            // paymentModeKey: r.paymentModeKey,
            // remainingFeesAmount: r.remainingFeesAmount,
            // accountantRemarks: r.accountantRemarks,
            // admissionConfirmDate: r?.admissionConfirmDate,

            // principalName: r?.principalName,

            // docVerificationClerkRemark: r?.docVerificationClerkRemark,
            // principalRemarksEn: r?.principalRemarksEn,
          };
        });
        // console.log("Result", _res);
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        callCatchMethod(error, language);
      });
  };

  const onSubmitForm = (formData) => {
    console.log("formData", formData);
    // Save - DB
    let _body = {
      ...formData,
      locatedAt: Number(formData.locatedAt),
      activeFlag: formData.activeFlag,
      // lastSchoolAdmissionDate: moment(
      //   formData?.lastSchoolAdmissionDate,
      //   "DD-MM-YYYY"
      // ).format("YYYY-MM-DD"),
      // lastSchoolLeavingDate: moment(
      //   formData?.lastSchoolLeavingDate,
      //   "DD-MM-YYYY"
      // ).format("YYYY-MM-DD"),

      // traineeDateOfBirth: moment(
      //   formData?.traineeDateOfBirth,
      //   "DD-MM-YYYY"
      // ).format("DD-MM-YYYY"),

      // ).format("YYYY-MM-DD"),

      itiKey: formData?.itiAllocatedKey,
      itiName: itiKeys?.find((item) => item?.id == formData?.itiAllocatedKey)
        ?.itiName,
      itiTradeName: tradeKeys?.find((item) => item?.id == formData?.itiTradeKey)
        ?.tradeName,
      allotedTradeDuration: tradeKeys?.find(
        (item) => item?.id == formData?.itiTradeKey
      )?.tradeDuration,

      casteCategoryName: castCategoryNames?.find(
        (item) => item?.id == formData?.casteCategoryKey
      )?.castCategory,
      casteName: castNames?.find((item) => item?.id == formData?.casteKey)
        ?.cast,
      religionName: religions?.find((item) => item?.id == formData?.religionKey)
        ?.religion,

      stateName: stateKeys?.find((i) => i.id == formData?.stateKey)?.stateName,

      itiNameAllocated: itiKeys?.find(
        (item) => item?.id == formData?.itiAllocatedKey
      )?.itiName,
      itiCodeAllocated: itiKeys?.find(
        (item) => item?.id == formData?.itiAllocatedKey
      )?.itiCode,

      traineePhotograph: encrptTraineePhotograph,
      traineeAadharCardDocument: encrptTraineeAadhar,
      castCertificate: encrptCastCert,
      leavingCertificateDocument: encrptTraineeLC,
      lastYearMarksheet: encrptTraineeLastYrMarksheet,
      dvetAllotmentLetter: encrptDvetAllotmentLetter,
      incomeProof: encrptIncomeProof,
      nonCreamylayer: encrptNonCreamylayer,

      // incomeProof: incomeProof,
    };
    if (btnSaveText === "Save") {
      setLoading(true);
      console.log("_body", _body);
      const tempData = axios
        .post(`${urls.SCHOOL}/trnItiTraineeAdmissionForm/save`, _body, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setLoading(false);
          console.log("res---", res);
          if (res.status == 201) {
            sweetAlert("Saved!", "Record Saved successfully !", "success");
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setShowTable(true);
            setIsReassignByDocVer(false);
            setIsReassignByPrincipal(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            docsReset();
          }
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      setLoading(true);
      console.log("_body", _body);
      axios
        .post(`${urls.SCHOOL}/trnItiTraineeAdmissionForm/save`, _body, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setLoading(false);
          console.log("res", res);
          if (res.status == 201) {
            formData.id
              ? sweetAlert(
                  "Updated!",
                  "Record Updated successfully !",
                  "success"
                )
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            getItiStudentAdmission();
            setButtonInputState(false);
            setEditButtonInputState(false);
            setIsOpenCollapse(false);
            setShowTable(true);
            docsReset();
          }
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
        });
    }
    // StatusByDocsVerificationClerk
    else if (btnSaveText === "StatusByDocsVerificationClerk") {
      let _isApproved = watch("action");
      console.log("_body", _body);
      let _res = {
        ..._body,
        id,
        role: "DOCUMENT_VERFICATION",
        // docVerificationClerkRemark: formData?.finalRemark,
      };
      console.log("_body", _body);
      console.log("_res", _res);
      setLoading(true);
      axios
        .post(`${urls.SCHOOL}/trnItiTraineeAdmissionForm/updateStatus`, _res, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setLoading(false);
          console.log("res", res);
          if (res.status == 201 || res.status == 200) {
            _isApproved === "APPROVE"
              ? sweetAlert(
                  "Approved!",
                  "Application Approved successfully !",
                  "success"
                )
              : sweetAlert(
                  "Reassign!",
                  "Application Sent to the Clerk successfully !",
                  "success"
                );
            getItiStudentAdmission();
            setButtonInputState(false);
            setEditButtonInputState(false);
            setIsOpenCollapse(false);
            setShowTable(true);
            setBtnSaveText("Save");
          }
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
        });
    }
    // StatusByPrincipal
    else if (btnSaveText === "StatusByPrincipal") {
      let _isApproved = watch("action");
      console.log("_body", _body);
      let _res = {
        // ..._body,
        id,
        role: "PRINCIPAL",
        principalUserId: user?.id,
        action: formData?.action,
        principalRemarksEn: formData?.principalRemarksEn,
      };
      console.log("_body", _body);
      console.log("_res", _res);
      setLoading(true);
      axios
        .post(`${urls.SCHOOL}/trnItiTraineeAdmissionForm/updateStatus`, _res, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setLoading(false);
          console.log("res", res);
          if (res.status == 201 || res.status == 200) {
            _isApproved === "APPROVE"
              ? sweetAlert(
                  "Approved!",
                  "Application Approved successfully !",
                  "success"
                )
              : sweetAlert(
                  "Reassign!",
                  "Application Sent to the Clerk successfully !",
                  "success"
                );
            getItiStudentAdmission();
            // setButtonInputState(false);
            setEditButtonInputState(false);
            setIsOpenCollapse(false);
            setShowTable(true);
            setBtnSaveText("Save");
          }
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
        });
    }
    // StatusByPrincipal
    else if (btnSaveText === "StatusByAccountant") {
      // let _isApproved = watch("action");
      console.log("_body", _body);
      let _res = {
        // ..._body,
        id,
        role: "PAYMENT",
        // action: formData?.action,
        admissionFees: formData?.admissionFees,
        deposit: formData?.deposit,
        totalAdmissionFeeRs: formData?.totalAdmissionFeeRs,
        admissionFeeAmountToPay: formData?.admissionFeeAmountToPay,
        remainingFeesAmount: formData?.remainingFeesAmount,

        paymentTypeKey: formData?.paymentTypeKey,
        paymentModeKey: formData?.paymentModeKey,
        accountantRemarks: formData?.accountantRemarks,
      };
      console.log("_body", _body);
      console.log("_res", _res);
      setLoading(true);
      axios
        .post(`${urls.SCHOOL}/trnItiTraineeAdmissionForm/updateStatus`, _res, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setLoading(false);
          console.log("res", res);
          if (res.status == 201 || res.status == 200) {
            sweetAlert("Saved!", "Admission done successfully !", "success");
            getItiStudentAdmission();
            // setButtonInputState(false);
            setEditButtonInputState(false);
            setIsOpenCollapse(false);
            setShowTable(true);
            setBtnSaveText("Save");
            setIsFeesSection(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
        });
    }
  };

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to Inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          setLoading(true);
          axios
            .post(`${urls.SCHOOL}/trnItiTraineeAdmissionForm/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              setLoading(false);
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getItiStudentAdmission();
                setButtonInputState(false);
                // setButtonInputState(false);
              }
            })
            .catch((error) => {
              setLoading(false);
              callCatchMethod(error, language);
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    } else {
      swal({
        title: "Activate?",
        text: "Are you sure you want to Activate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          setLoading(true);
          axios
            .post(`${urls.SCHOOL}/trnItiTraineeAdmissionForm/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              setLoading(false);
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                // getPaymentRate();
                getItiStudentAdmission();
                setButtonInputState(false);
              }
            })
            .catch((error) => {
              setLoading(false);
              callCatchMethod(error, language);
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setShowTable(true);
    setEditButtonInputState(false);
    docsReset();
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
    docsReset();
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    itiKey: "",
    traineeFirstName: "",
    traineeMiddleName: "",
    traineeLastName: "",
    fatherFirstName: "",
    fatherMiddleName: "",
    fatherLastName: "",
    motherFirstName: "",
    gender: "",
    traineeAadharNumber: "",

    casteCategoryKey: "",
    casteKey: "",
    religionKey: "",
    citizenshipName: "",
    motherTongueName: "",
    address: "",
    locatedAt: "",
    area: "",
    districtName: "",
    stateKey: "",
    pincode: "",
    traineeDateOfBirth: null,
    traineeBirthPlace: "",

    allotmentRound: "",
    preferenceNumber: "",
    allotmentCategory: "",
    mcode: "",
    itiAllocatedKey: "",
    itiTradeKey: "",

    lastSchoolName: "",
    lastSchoolAdmissionDate: null,
    lastSchoolLeavingDate: null,
    lastSchoolLeavingReason: "",
    studentBehaviour: "",
    lastClass: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    id: null,

    itiKey: "",

    traineeFirstName: "",
    traineeMiddleName: "",
    traineeLastName: "",
    fatherFirstName: "",
    fatherMiddleName: "",
    fatherLastName: "",
    motherFirstName: "",
    gender: "",
    traineeAadharNumber: "",

    casteCategoryKey: "",
    casteKey: "",
    religionKey: "",
    citizenshipName: "",
    motherTongueName: "",
    address: "",
    locatedAt: "",
    area: "",
    stateKey: "",
    pincode: "",
    traineeDateOfBirth: null,
    traineeBirthPlace: "",

    allotmentRound: "",
    preferenceNumber: "",
    allotmentCategory: "",
    mcode: "",
    itiAllocatedKey: "",
    itiTradeKey: "",

    lastSchoolName: "",
    lastSchoolAdmissionDate: null,
    lastSchoolLeavingDate: null,
    lastSchoolLeavingReason: "",
    studentBehaviour: "",
    lastClass: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: labels.srNo,
      flex: 1,
    },
    {
      field: "admissionRegistrationNo",
      headerName: labels.admissionRegitrationNo,
      flex: 1,
      // width: 200,
    },
    {
      field: "itiName",
      headerName: labels.itiName,
      flex: 1,
      // width: 100,
    },
    {
      field: "traineeName",
      headerName: labels.traineeName,
      flex: 1,
      // width: 150,
    },
    // {
    //   field: "studentGeneralRegistrationNumber",
    //   headerName: labels.studentGRnumber,
    //   flex: 1,
    //   // width: 200,
    // },
    {
      field: "applicationStatus",
      headerName: labels.applicationStatus,
      // headerName: labels.emailID,
      width: 200,
    },

    {
      field: "Actions",
      headerName: labels.actions,
      width: 220,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        let status = params.row.applicationStatus;
        let paramData = params.row;
        return (
          <Box>
            {/* Edit and delete accessable only clerk & admin*/}
            {(authority?.includes("ADMIN_OFFICER") ||
              authority?.includes("ENTRY")) &&
              status == "APPLICATION_CREATED" && (
                <>
                  {/* Edit */}
                  <IconButton
                    disabled={editButtonInputState}
                    onClick={() => {
                      console.log("DATAAAA_____", paramData);
                      setBtnSaveText("Update"), getDocuments(paramData);
                      setDataValidation(itiTraineeAdmissionSchema);
                      setID(params.row.id),
                        setIsOpenCollapse(true),
                        setShowTable(false),
                        setSlideChecked(true);
                      setReadonlyFields(false);
                      setButtonInputState(true);

                      // setButtonInputState(true);
                      reset(params.row);
                    }}
                  >
                    <EditIcon style={{ color: "#556CD6" }} />
                  </IconButton>

                  {/* Delete */}
                  <IconButton
                    disabled={editButtonInputState}
                    onClick={() => {
                      setBtnSaveText("Update");
                      setID(params.row.id), setSlideChecked(true);
                      console.log("params.row: ", params.row);
                      reset(params.row);
                    }}
                  >
                    {params.row.activeFlag == "Y" ? (
                      <ToggleOnIcon
                        style={{ color: "green", fontSize: 30 }}
                        onClick={() => deleteById(params.row.id, "N")}
                      />
                    ) : (
                      <ToggleOffIcon
                        style={{ color: "red", fontSize: 30 }}
                        onClick={() => deleteById(params.row.id, "Y")}
                      />
                    )}
                  </IconButton>
                </>
              )}

            {/* When docs verification clerk reassign the application then entry clerk action button*/}
            {(authority?.includes("ADMIN_OFFICER") ||
              authority?.includes("ENTRY")) &&
              status == "REASSAIGN_BY_DOCS_VERIFICATION_CLERK" && (
                <IconButton>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    endIcon={<CheckIcon />}
                    onClick={() => {
                      setBtnSaveText("Save"), setIsReassignByDocVer(true);
                      setDataValidation(itiTraineeAdmissionSchema);
                      setID(params.row.id), getDocuments(paramData);
                      setIsOpenCollapse(true), setSlideChecked(true);
                      setShowTable(false), setButtonInputState(true);
                      reset(params.row);
                      setReadonlyFields(false);
                    }}
                  >
                    {labels.action}
                  </Button>
                </IconButton>
              )}
            {/* When principal reassign the application then entry clerk action button*/}
            {(authority?.includes("ADMIN_OFFICER") ||
              authority?.includes("ENTRY")) &&
              status == "REASSAIGN_BY_PRINCIPAL" && (
                <IconButton>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    endIcon={<CheckIcon />}
                    onClick={() => {
                      setBtnSaveText("Save"), setIsReassignByPrincipal(true);
                      setDataValidation(itiTraineeAdmissionSchema);
                      setID(params.row.id),
                        // getDocuments(paramData);
                        setIsOpenCollapse(true),
                        setSlideChecked(true);
                      setShowTable(false), setButtonInputState(true);
                      reset(params.row);
                      setReadonlyFields(false);
                    }}
                  >
                    Action
                  </Button>
                </IconButton>
              )}

            {/* Approval from docs verification clerk */}
            {(authority?.includes("ADMIN_OFFICER") ||
              authority?.includes("DOCUMENT_VERIFICATION")) &&
              status == "APPLICATION_CREATED" && (
                <IconButton>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    endIcon={<CheckIcon />}
                    onClick={() => {
                      setDocView(true);
                      setDataValidation(principalOrDocsClerkSchema);
                      setBtnSaveText("StatusByDocsVerificationClerk"),
                        setID(params.row.id),
                        // getDocuments(paramData);
                        setIsOpenCollapse(true),
                        setSlideChecked(true);
                      setShowTable(false), setButtonInputState(true);
                      reset(params.row);
                      setReadonlyFields(true);
                    }}
                  >
                    {labels.action}
                  </Button>
                </IconButton>
              )}
            {/* Approval from principal*/}
            {(authority?.includes("ADMIN_OFFICER") ||
              authority?.includes("APPROVAL")) &&
              status == "DOCUMENT_VERIFIED" && (
                <IconButton>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    endIcon={<CheckIcon />}
                    onClick={() => {
                      setDocView(true);
                      setDataValidation(principalOrDocsClerkSchema);
                      setBtnSaveText("StatusByPrincipal"),
                        setID(params.row.id),
                        getDocuments(paramData);
                      setIsOpenCollapse(true), setSlideChecked(true);
                      setShowTable(false), setButtonInputState(true);
                      reset(params.row);
                      setReadonlyFields(true);
                    }}
                  >
                    Action
                  </Button>
                </IconButton>
              )}
            {/* Approval from ACCOUNTANT*/}
            {(authority?.includes("ADMIN_OFFICER") ||
              authority?.includes("ACCOUNTANT")) &&
              status == "APPROVE_BY_PRINCIPAL" && (
                <IconButton>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    endIcon={<CheckIcon />}
                    onClick={() => {
                      console.log("paramhhhhhs", params.row);
                      setDocView(true);
                      setBtnSaveText("StatusByAccountant"),
                        setDataValidation(accountantSchema);
                      setID(params.row.id), getDocuments(paramData);
                      setIsOpenCollapse(true), setSlideChecked(true);
                      setShowTable(false), setButtonInputState(true);
                      reset(params.row);
                      setReadonlyFields(true);
                      setIsFeesSection(true);
                    }}
                  >
                    Action
                  </Button>
                </IconButton>
              )}
            {/* Admission Confirmation Reciept*/}
            {(authority?.includes("ADMIN_OFFICER") ||
              authority?.includes("ACCOUNTANT")) &&
              status == "PAYAMENT_SUCCESSFUL" && (
                <IconButton
                  onClick={() => {
                    setRecieptData(params.row);
                    setIsReady("none");
                  }}
                >
                  <PrintIcon style={{ color: "#556CD6" }} />
                </IconButton>
              )}
          </Box>
        );
      },
    },
  ];

  return (
    <>
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
          padding: 1,
          paddingBottom: "30px",
        }}
      >
        <Box
          container
          display="flex"
          justifyContent="center"
          justifyItems="center"
          padding={2}
          marginTop={2}
          sx={{
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2 style={{ marginBottom: 0 }}>{labels.itiTraineeDetails}</h2>
        </Box>
        <Paper style={{ display: isReady }}>
          {recieptData && showTable === true && (
            <AdmissionConfirmationSlipToPrint
              ref={componentRef}
              data={recieptData}
              // studentData={studentData}
              language={language}
            />
          )}
        </Paper>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginLeft: 5,
            marginRight: 5,
            // marginTop: 2,
            // marginBottom: 3,
            padding: 2,
            // border:1,
            // borderColor:'grey.500'
          }}
        >
          <Box p={1}>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)} disabled>
                {isOpenCollapse && (
                  <Slide
                    direction="down"
                    in={slideChecked}
                    mountOnEnter
                    unmountOnExit
                  >
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        container
                        display="flex"
                        justifyContent="center"
                        justifyItems="center"
                        padding={2}
                        marginBottom={2}
                        sx={{
                          background:
                            "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                          borderRadius: "6% / 100%",
                        }}
                      >
                        <Grid item>
                          <h2 style={{ marginBottom: 0 }}>
                            {labels.allotementDetails}
                          </h2>
                        </Grid>
                      </Grid>
                      {/* itiAllocatedKey */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl sx={{ width: 230 }}>
                          <InputLabel required error={!!errors.itiAllocatedKey}>
                            {labels.allotedItiName}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="itiAllocatedKey"
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                // readOnly={readonlyFields}
                                disabled={readonlyFields}
                                variant="standard"
                                {...field}
                                error={!!errors.itiAllocatedKey}
                              >
                                {itiKeys &&
                                  itiKeys.map((iti) => (
                                    <MenuItem key={iti.id} value={iti.id}>
                                      {iti?.itiName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText error={!!errors.itiAllocatedKey}>
                            {errors?.itiAllocatedKey ? labels.itiNameReq : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/* itiTradeKey */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl sx={{ width: 230 }}>
                          <InputLabel required error={!!errors.itiTradeKey}>
                            {labels.allotedTradeName}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="itiTradeKey"
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                // readOnly={readonlyFields}
                                disabled={readonlyFields}
                                variant="standard"
                                {...field}
                                error={!!errors.itiTradeKey}
                              >
                                {tradeKeys &&
                                  tradeKeys.map((trd) => (
                                    <MenuItem key={trd.id} value={trd.id}>
                                      {trd?.tradeName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText error={!!errors.itiTradeKey}>
                            {errors?.itiTradeKey ? labels.itiTradeReq : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/* Select AY */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl sx={{ width: 230 }}>
                          <InputLabel required error={!!errors.academicYearKey}>
                            {labels.selectAcademicYear}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="academicYearKey"
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                disabled={readonlyFields}
                                variant="standard"
                                {...field}
                                error={!!errors.academicYearKey}
                              >
                                {academicYearList &&
                                  academicYearList.map((ay) => (
                                    <MenuItem key={ay.id} value={ay.id}>
                                      {ay?.academicYear}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText error={!!errors.academicYearKey}>
                            {errors?.academicYearKey
                              ? labels.academicYearRequired
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/* allotmentRound*/}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          label={`${labels.allotementRound} *`}
                          {...register("allotmentRound")}
                          error={!!errors.allotmentRound}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                          }}
                          helperText={
                            errors?.allotmentRound
                              ? labels.allotmentRoundReq
                              : null
                          }
                        />
                      </Grid>
                      {/* preferenceNumber */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          label={`${labels.preferenceNumber} *`}
                          {...register("preferenceNumber")}
                          error={!!errors.preferenceNumber}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.preferenceNumber
                              ? labels.preferenceNumberReq
                              : null
                          }
                        />
                      </Grid>
                      {/* allotmentCategoryKey */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl sx={{ width: 230 }}>
                          <InputLabel
                            required
                            error={!!errors.allotmentCategory}
                          >
                            {labels.allotementCategory}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="allotmentCategory"
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                // readOnly={readonlyFields}
                                disabled={readonlyFields}
                                variant="standard"
                                {...field}
                                error={!!errors.allotmentCategory}
                              >
                                {castCategoryNames &&
                                  castCategoryNames.map((cg, index) => (
                                    <MenuItem key={index} value={cg.id}>
                                      {language == "en"
                                        ? cg?.castCategory
                                        : cg?.castCategoryMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText error={!!errors.allotmentCategory}>
                            {errors?.allotmentCategory
                              ? labels.allotmentCategoryReq
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Divider />
                      <Grid
                        container
                        display="flex"
                        justifyContent="center"
                        justifyItems="center"
                        padding={2}
                        marginBottom={2}
                        sx={{
                          background:
                            "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                          borderRadius: "6% / 100%",
                        }}
                      >
                        <Grid item>
                          <h2 style={{ marginBottom: 0 }}>
                            {labels.studentPersonalInfo}
                          </h2>
                        </Grid>
                      </Grid>
                      {/* traineeFirstName */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          label={`${labels.traineeFirstName} *`}
                          {...register("traineeFirstName")}
                          error={!!errors.traineeFirstName}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.traineeFirstName
                              ? labels.traineeFirstNameReq
                              : null
                          }
                        />
                      </Grid>
                      {/* traineeMiddleName */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          label={`${labels.traineeMiddleName} *`}
                          {...register("traineeMiddleName")}
                          error={!!errors.traineeMiddleName}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.traineeMiddleName
                              ? labels.traineeMiddleNameReq
                              : null
                          }
                        />
                      </Grid>
                      {/* traineeLastName */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          label={`${labels.traineeLastName} *`}
                          {...register("traineeLastName")}
                          error={!!errors.traineeLastName}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.traineeLastName
                              ? labels.traineeLastNameReq
                              : null
                          }
                        />
                      </Grid>
                      {/* fatherFirstName */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          label={`${labels.fatherFirstName} *`}
                          {...register("fatherFirstName")}
                          error={!!errors.fatherFirstName}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.fatherFirstName
                              ? labels.fatherFirstNameReq
                              : null
                          }
                        />
                      </Grid>
                      {/* fatherMiddleName */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          label={`${labels.fatherMiddleName} *`}
                          {...register("fatherMiddleName")}
                          error={!!errors.fatherMiddleName}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.fatherMiddleName
                              ? labels.fatherMiddleNameReq
                              : null
                          }
                        />
                      </Grid>
                      {/* fatherLastName */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          label={`${labels.fatherLastName} *`}
                          {...register("fatherLastName")}
                          error={!!errors.fatherLastName}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.fatherLastName
                              ? labels.fatherLastNameReq
                              : null
                          }
                        />
                      </Grid>
                      {/*motherFirstName */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          label={`${labels.motherName} *`}
                          {...register("motherFirstName")}
                          error={!!errors.motherFirstName}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.motherFirstName
                              ? labels.motherFirstNameReq
                              : null
                          }
                        />
                      </Grid>
                      {/* Gender */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl sx={{ width: 230 }}>
                          <InputLabel required error={!!errors.gender}>
                            {labels.gender}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="gender"
                            rules={{ required: true }}
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                // readOnly={readonlyFields}
                                disabled={readonlyFields}
                                variant="standard"
                                {...field}
                                error={!!errors.gender}
                              >
                                {gendersList &&
                                  gendersList.map((gender) => (
                                    <MenuItem
                                      key={gender.id}
                                      value={gender.value}
                                    >
                                      {gender?.gender}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText error={!!errors.gender}>
                            {errors?.gender ? labels.genderReq : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/* traineeMobileNumber */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          label={`${labels.traineeMoNo} *`}
                          {...register("traineeMobileNumber")}
                          error={!!errors.traineeMobileNumber}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.traineeMobileNumber
                              ? labels.traineeMobileNumberReq
                              : null
                          }
                        />
                      </Grid>
                      {/* parentMobileNumber */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          label={`${labels.parentMobileNo} *`}
                          {...register("parentMobileNumber")}
                          error={!!errors.parentMobileNumber}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.parentMobileNumber
                              ? labels.parentMobileNumberReq
                              : null
                          }
                        />
                      </Grid>
                      {/* traineeEmailId */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          label={`${labels.traineeEmailId} *`}
                          {...register("traineeEmailId")}
                          error={!!errors.traineeEmailId}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.traineeEmailId
                              ? labels.traineeEmailIdReq
                              : null
                          }
                        />
                      </Grid>
                      {/* traineeAadharNumber */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          label={`${labels.aadharNumber} *`}
                          {...register("traineeAadharNumber")}
                          error={!!errors.traineeAadharNumber}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.traineeAadharNumber
                              ? labels.traineeAadharNumberReq
                              : null
                          }
                        />
                      </Grid>
                      <Divider />
                      <Grid
                        container
                        display="flex"
                        justifyContent="center"
                        justifyItems="center"
                        padding={2}
                        marginBottom={2}
                        sx={{
                          background:
                            "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                          borderRadius: "6% / 100%",
                        }}
                      >
                        <Grid item>
                          <h2 style={{ marginBottom: 0 }}>
                            {labels.studentOthInfo}
                          </h2>
                        </Grid>
                      </Grid>
                      {/* religionKey */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl sx={{ width: 230 }}>
                          <InputLabel required error={!!errors.religionKey}>
                            {labels.religion}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="religionKey"
                            rules={{ required: true }}
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                // readOnly={readonlyFields}
                                disabled={readonlyFields}
                                variant="standard"
                                {...field}
                                error={!!errors.religionKey}
                              >
                                {religions &&
                                  religions.map((religion, index) => (
                                    <MenuItem key={index} value={religion.id}>
                                      {language == "en"
                                        ? religion?.religion
                                        : religion?.religionMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText error={!!errors.religionKey}>
                            {errors?.religionKey ? labels.religionKeyReq : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/* Cast Category */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl sx={{ width: 230 }}>
                          <InputLabel
                            required
                            error={!!errors.casteCategoryKey}
                          >
                            {labels.casteCategory}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="casteCategoryKey"
                            rules={{ required: true }}
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                // readOnly={readonlyFields}
                                disabled={readonlyFields}
                                variant="standard"
                                {...field}
                                error={!!errors.casteCategoryKey}
                              >
                                {castCategoryNames &&
                                  castCategoryNames.map((cg, index) => (
                                    <MenuItem key={index} value={cg.id}>
                                      {language == "en"
                                        ? cg?.castCategory
                                        : cg?.castCategoryMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText error={!!errors.casteCategoryKey}>
                            {errors?.casteCategoryKey
                              ? labels.casteCategoryKeyReq
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/* Cast Name */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl sx={{ width: 230 }}>
                          <InputLabel required error={!!errors.casteKey}>
                            {labels.casteName}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="casteKey"
                            rules={{ required: true }}
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                // readOnly={readonlyFields}
                                disabled={readonlyFields}
                                variant="standard"
                                {...field}
                                error={!!errors.casteKey}
                              >
                                {castNames &&
                                  castNames.map((cast, index) => (
                                    <MenuItem key={index} value={cast.id}>
                                      {language == "en"
                                        ? cast?.cast
                                        : cast?.castMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText error={!!errors.casteKey}>
                            {errors?.casteKey ? labels.casteKeyReq : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/* citizenshipName */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl sx={{ width: 230 }}>
                          <InputLabel required error={!!errors.citizenshipName}>
                            {labels.nationality}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="citizenshipName"
                            rules={{ required: true }}
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                // readOnly={readonlyFields}
                                disabled={readonlyFields}
                                variant="standard"
                                {...field}
                                error={!!errors.citizenshipName}
                              >
                                {citizenshipList &&
                                  citizenshipList.map((citizen) => (
                                    <MenuItem
                                      key={citizen.id}
                                      value={citizen.citizen}
                                    >
                                      {language == "en"
                                        ? citizen?.citizen
                                        : citizen?.citizen}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText error={!!errors.citizenshipName}>
                            {errors?.citizenshipName
                              ? labels.nationalityReq
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/* motherTongueName */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl sx={{ width: 230 }}>
                          <InputLabel
                            required
                            error={!!errors.motherTongueName}
                          >
                            {labels.motherTongue}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="motherTongueName"
                            rules={{ required: true }}
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                // readOnly={readonlyFields}
                                disabled={readonlyFields}
                                variant="standard"
                                {...field}
                                error={!!errors.motherTongueName}
                              >
                                {motherTongueList &&
                                  motherTongueList.map((motherTongue) => (
                                    <MenuItem
                                      key={motherTongue.id}
                                      value={motherTongue.motherTongue}
                                    >
                                      {language == "en"
                                        ? motherTongue?.motherTongue
                                        : motherTongue?.motherTongue}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText error={!!errors.motherTongueName}>
                            {errors?.motherTongueName
                              ? labels.motherTongueNameReq
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* address */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          label={`${labels.address} *`}
                          {...register("address")}
                          error={!!errors.address}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.address ? labels.addressReq : null
                          }
                        />
                      </Grid>
                      {/* locatedAt */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl sx={{ width: 230 }}>
                          <InputLabel required error={!!errors.locatedAt}>
                            {labels.locatedAt}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="locatedAt"
                            rules={{ required: true }}
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                // readOnly={readonlyFields}
                                disabled={readonlyFields}
                                variant="standard"
                                {...field}
                                error={!!errors.locatedAt}
                              >
                                {locatedAt &&
                                  locatedAt.map((area) => (
                                    <MenuItem key={area.id} value={area.id}>
                                      {area.locatedAt}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText error={!!errors.locatedAt}>
                            {errors?.locatedAt ? labels.locatedAtReq : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/* area*/}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          label={`${labels.areaName} *`}
                          {...register("area")}
                          error={!!errors.area}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={errors?.area ? labels.areaReq : null}
                        />
                      </Grid>
                      {/* stateKey*/}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl sx={{ width: 230 }}>
                          <InputLabel required error={!!errors.stateKey}>
                            {labels.state}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="stateKey"
                            rules={{ required: true }}
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                // readOnly={readonlyFields}
                                disabled={readonlyFields}
                                variant="standard"
                                {...field}
                                error={!!errors.stateKey}
                              >
                                {stateKeys &&
                                  stateKeys.map((state) => (
                                    <MenuItem key={state.id} value={state.id}>
                                      {language === "en"
                                        ? state.stateName
                                        : state.stateNameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText error={!!errors.stateKey}>
                            {errors?.stateKey ? labels.stateNameReq : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/* districtName*/}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          label={`${labels.district} *`}
                          {...register("districtName")}
                          error={!!errors.districtName}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.districtName ? labels.districtNameReq : null
                          }
                        />
                      </Grid>

                      {/*Pin Code*/}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          label={`${labels.pincode} *`}
                          {...register("pincode")}
                          error={!!errors.pincode}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.pincode ? labels.pincodeReq : null
                          }
                        />
                      </Grid>

                      {/* traineeDateOfBirth */}
                      {/* <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Controller
                        control={control}
                        name="traineeDateOfBirth"
                        rules={{ required: true }}
                        defaultValue={null}
                        render={({ field: { onChange, ...props } }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              label={<span>{`${labels.dateOfbirth} *`}</span>}
                              variant="standard"
                              inputFormat="DD/MM/YYYY"
                              {...props}
                              onChange={(date) =>
                                onChange(moment(date).format("YYYY-MM-DD"))
                              }
                              // selected={fromDate}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="standard"
                                  fullWidth
                                  disabled={readonlyFields}
                                  // fullWidth
                                  sx={{ width: 230 }}
                                  size="small"
                                  error={!!errors.traineeDateOfBirth}
                                  // helperText={
                                  //   errors.traineeDateOfBirth
                                  //     ? labels.traineeDateOfBirth
                                  //     : null
                                  // }
                                />
                              )}
                            />
                            <FormHelperText>
                              {errors?.traineeDateOfBirth
                                ? errors.traineeDateOfBirth.message
                                : null}
                            </FormHelperText>
                          </LocalizationProvider>
                        )}
                      />
                    </Grid> */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl error={errors?.traineeDateOfBirth}>
                          {/* <Controller
                          name="traineeDateOfBirth"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                disableFuture
                                variant="standard"
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    {`${labels.dateOfbirth} *`}
                                  </span>
                                }
                                value={field.value}
                                // onChange={(date) =>
                                //   field.onChange(
                                //     moment(date).format("DD/MM/YYYY")
                                //   )
                                // }
                                onChange={(date) =>
                                  onChange(moment(date).format("YYYY-MM-DD"))
                                }
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    variant="standard"
                                    error={errors?.traineeDateOfBirth}
                                    size="small"
                                    sx={{ width: 230 }}
                                    disabled={readonlyFields}
                                    fullWidth
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
                        /> */}
                          <Controller
                            control={control}
                            name="traineeDateOfBirth"
                            rules={{ required: true }}
                            defaultValue={null}
                            render={({ field: { onChange, ...props } }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  disabled={readonlyFields}
                                  disableFuture
                                  label={
                                    <span className="required">
                                      {`${labels.dateOfbirth} *`}
                                    </span>
                                  }
                                  variant="standard"
                                  inputFormat="DD/MM/YYYY"
                                  {...props}
                                  onChange={(date) =>
                                    onChange(moment(date).format("YYYY-MM-DD"))
                                  }
                                  // selected={fromDate}
                                  center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      variant="standard"
                                      fullWidth
                                      // fullWidth
                                      sx={{ width: 230 }}
                                      size="small"
                                      error={!!errors.traineeDateOfBirth}
                                      // helperText={
                                      //   errors.studentDateOfBirth
                                      //     ? labels.studentDateOfBirth
                                      //     : null
                                      // }
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText sx={{ width: 210 }}>
                            {errors?.traineeDateOfBirth
                              ? labels?.traineeDateOfBirthReqAdmission
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/*traineeBirthPlace */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          label={`${labels.birthPlace} *`}
                          {...register("traineeBirthPlace")}
                          error={!!errors.traineeBirthPlace}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                          }}
                          helperText={
                            errors?.traineeBirthPlace
                              ? labels.traineeBirthPlaceReq
                              : null
                          }
                        />
                      </Grid>

                      {/* <Divider /> */}

                      <Divider />
                      <Grid
                        container
                        display="flex"
                        justifyContent="center"
                        justifyItems="center"
                        padding={2}
                        marginBottom={2}
                        sx={{
                          background:
                            "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                          borderRadius: "6% / 100%",
                        }}
                      >
                        <Grid item>
                          <h2 style={{ marginBottom: 0 }}>
                            {labels.lastSchoolDetails}
                          </h2>
                        </Grid>
                      </Grid>
                      {/*lastSchoolName*/}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          label={`${labels.lastSchoolNamee} *`}
                          {...register("lastSchoolName")}
                          error={!!errors.lastSchoolName}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.lastSchoolName
                              ? labels.lastSchoolNameReq
                              : null
                          }
                        />
                      </Grid>
                      {/* lastClass */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          label={`${labels.lastClass} *`}
                          {...register("lastClass")}
                          error={!!errors.lastClass}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.lastClass ? labels.lastClassReq : null
                          }
                        />
                      </Grid>
                      {/* mediumOfEducation */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          label={`${labels.mediumOfEdu} *`}
                          {...register("mediumOfEducation")}
                          error={!!errors.mediumOfEducation}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.mediumOfEducation
                              ? labels.mediumOfEducationReq
                              : null
                          }
                        />
                      </Grid>
                      {/* Last School Admission Date */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl error={errors?.lastSchoolAdmissionDate}>
                          <Controller
                            control={control}
                            name="lastSchoolAdmissionDate"
                            rules={{ required: true }}
                            defaultValue={null}
                            render={({ field: { onChange, ...props } }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  disabled={readonlyFields}
                                  disableFuture
                                  label={
                                    <span className="required">
                                      {`${labels.lastSchoolAdmissionDateiti} *`}
                                    </span>
                                  }
                                  variant="standard"
                                  inputFormat="DD/MM/YYYY"
                                  {...props}
                                  onChange={(date) =>
                                    onChange(moment(date).format("YYYY-MM-DD"))
                                  }
                                  // selected={fromDate}
                                  center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      variant="standard"
                                      fullWidth
                                      // disabled={readonlyFields}
                                      // fullWidth
                                      sx={{ width: 230 }}
                                      size="small"
                                      error={!!errors.lastSchoolAdmissionDate}
                                      helperText={
                                        errors.lastSchoolAdmissionDate
                                          ? labels.lastSchoolAdmissionDateitiReq
                                          : null
                                      }
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                        </FormControl>
                      </Grid>
                      {/* Last School Leaving Date */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl error={errors?.lastSchoolLeavingDate}>
                          <Controller
                            control={control}
                            name="lastSchoolLeavingDate"
                            rules={{ required: true }}
                            defaultValue={null}
                            render={({ field: { onChange, ...props } }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  disabled={readonlyFields}
                                  disableFuture
                                  label={
                                    <span className="required">
                                      {`${labels.lastSchoolLeavingDate} *`}
                                    </span>
                                  }
                                  variant="standard"
                                  inputFormat="DD/MM/YYYY"
                                  {...props}
                                  onChange={(date) =>
                                    onChange(moment(date).format("YYYY-MM-DD"))
                                  }
                                  // selected={fromDate}
                                  center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      variant="standard"
                                      fullWidth
                                      // fullWidth
                                      sx={{ width: 230 }}
                                      size="small"
                                      error={!!errors.lastSchoolLeavingDate}
                                      helperText={
                                        errors.lastSchoolLeavingDate
                                          ? labels.lastSchoolLeavingDateitiReq
                                          : null
                                      }
                                    />
                                  )}
                                  minDate={watch("lastSchoolAdmissionDate")}
                                />
                              </LocalizationProvider>
                            )}
                          />
                        </FormControl>
                      </Grid>
                      {/* lastSchoolLeavingReason */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          label={`${labels.reasonForLeavingSchool} *`}
                          {...register("lastSchoolLeavingReason")}
                          error={!!errors.lastSchoolLeavingReason}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.lastSchoolLeavingReason
                              ? labels.lastSchoolLeavingReasonReq
                              : null
                          }
                        />
                      </Grid>
                      {/* Student Behaviour */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          label={labels.studentBehaviour}
                          {...register("studentBehaviour")}
                          error={!!errors.studentBehaviour}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.studentBehaviour
                              ? errors.studentBehaviour.message
                              : null
                          }
                        />
                      </Grid>

                      <Divider />
                      <Grid
                        container
                        display="flex"
                        justifyContent="center"
                        justifyItems="center"
                        padding={2}
                        marginBottom={2}
                        sx={{
                          background:
                            "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                          borderRadius: "6% / 100%",
                        }}
                      >
                        <Grid item>
                          <h2 style={{ marginBottom: 0 }}>
                            {labels.documents}
                          </h2>
                        </Grid>
                      </Grid>
                      {/* TraineePhotograph */}
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
                          marginBottom: "15px",
                          paddingLeft: "80px",
                          paddingRight: "80px",
                        }}
                      >
                        <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                          {/* <label>{labels.traineePhotograph}</label> */}
                          <InputLabel
                            required
                            error={!!errors?.traineePhotograph}
                          >
                            {labels.traineePhotograph}
                          </InputLabel>
                        </Grid>
                        <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                          {/* <UploadButton
                          error={!!errors?.traineePhotograph}
                          view={docView}
                          appName="TP"
                          serviceName="PARTMAP"
                          fileUpdater={setTraineePhotograph}
                          filePath={traineePhotograph}
                        /> */}
                          {/* <DocumentsUpload
                            error={!!errors?.traineePhotograph}
                            appName="TP"
                            serviceName="PARTMAP"
                            fileDtl={watch("traineePhotograph")}
                            fileKey={"traineePhotograph"}
                            showDel={!props.onlyDoc ? true : false}
                            view={docView}
                          /> */}
                          <DocumentsUploadIti
                            error={!!errors?.traineePhotograph}
                            appName="TP"
                            serviceName="PARTMAP"
                            fileDtl={watch("traineePhotograph")}
                            fileKey={"traineePhotograph"}
                            showDel={!props.onlyDoc ? true : false}
                            view={docView}
                            fileNameEncrypted={(path) => {
                              setEncrptTraineePhotograph(path);
                            }}
                            // showDel={pageMode ? false : true}
                            // error={!!errors?.studentBirthCertificate}
                            // appName="TP"
                            // serviceName="PARTMAP"
                            // fileUpdater={setStudentBirthCertificate}
                            // filePath={studentBirthCertificate}
                          />
                          <FormHelperText error={!!errors?.traineePhotograph}>
                            {errors?.traineePhotograph
                              ? labels?.traineePhotographReq
                              : null}
                          </FormHelperText>
                        </Grid>
                        {(authority?.includes("DOCUMENT_VERIFICATION") ||
                          isReassignByDocVer === true) && (
                          <>
                            <Grid
                              item
                              xl={4}
                              lg={4}
                              md={6}
                              sm={6}
                              xs={12}
                              p={1}
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <FormControl
                                // variant="outlined"
                                variant="standard"
                                size="small"
                                sx={{ m: 1, minWidth: 220 }}
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  {labels.action}
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      // required
                                      disabled={isReassignByDocVer}
                                      label={labels.action}
                                      // sx={{ width: 300 }}
                                      value={field.value}
                                      onChange={(value) =>
                                        field.onChange(value)
                                      }
                                    >
                                      <MenuItem value="APPROVE">
                                        {language == "en" ? "Approve" : "मंजूर"}
                                      </MenuItem>
                                      <MenuItem value="REASSAIGN">
                                        {language == "en"
                                          ? "Reassign"
                                          : "पुन्हा नियुक्त करा"}
                                      </MenuItem>
                                    </Select>
                                  )}
                                  name="traineePhotographDocStatus"
                                  control={control}
                                  defaultValue=""
                                />
                              </FormControl>
                            </Grid>
                            <Grid
                              item
                              xl={4}
                              lg={4}
                              md={6}
                              sm={6}
                              xs={12}
                              p={1}
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <TextField
                                id="standard-basic"
                                variant="standard"
                                // variant="outlined"
                                size="small"
                                // required
                                label={labels.remark}
                                {...register("traineePhotographDocRemark")}
                                error={!!errors.traineePhotographDocRemark}
                                sx={{ width: 230 }}
                                disabled={isReassignByDocVer}
                                InputProps={{
                                  style: { fontSize: 18 },
                                  // readOnly: readonlyFields
                                }}
                                InputLabelProps={{ style: { fontSize: 15 } }}
                                helperText={
                                  errors?.traineePhotographDocRemark
                                    ? errors.traineePhotographDocRemark.message
                                    : null
                                }
                              />
                            </Grid>
                          </>
                        )}
                      </Grid>
                      {/* TraineeAadharCardDocument */}
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
                          marginBottom: "15px",
                          paddingLeft: "80px",
                          paddingRight: "80px",
                        }}
                      >
                        <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                          {/* <label>{labels.traineeAadhar}</label> */}
                          <InputLabel
                            required
                            error={!!errors?.traineeAadharCardDocument}
                          >
                            {labels.traineeAadhar}
                          </InputLabel>
                        </Grid>
                        <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                          {/* <UploadButton
                          error={!!errors?.traineeAadharCardDocument}
                          view={docView}
                          appName="TP"
                          serviceName="PARTMAP"
                          fileUpdater={setTraineeAadharCardDocument}
                          filePath={traineeAadharCardDocument}
                        /> */}
                          {/* <DocumentsUpload
                            error={!!errors?.traineeAadharCardDocument}
                            appName="TP"
                            serviceName="PARTMAP"
                            fileDtl={watch("traineeAadharCardDocument")}
                            fileKey={"traineeAadharCardDocument"}
                            showDel={!props.onlyDoc ? true : false}
                            view={docView}
                          /> */}
                          <DocumentsUploadIti
                            error={!!errors?.traineeAadharCardDocument}
                            appName="TP"
                            serviceName="PARTMAP"
                            fileDtl={watch("traineeAadharCardDocument")}
                            fileKey={"traineeAadharCardDocument"}
                            showDel={!props.onlyDoc ? true : false}
                            view={docView}
                            fileNameEncrypted={(path) => {
                              setEncrptTraineeAadhar(path);
                            }}
                          />
                          <FormHelperText
                            error={!!errors?.traineeAadharCardDocument}
                          >
                            {errors?.traineeAadharCardDocument
                              ? labels.traineeAadharCardDocumentReq
                              : null}
                          </FormHelperText>
                        </Grid>
                        {(authority?.includes("DOCUMENT_VERIFICATION") ||
                          isReassignByDocVer === true) && (
                          <>
                            <Grid
                              item
                              xl={4}
                              lg={4}
                              md={6}
                              sm={6}
                              xs={12}
                              p={1}
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <FormControl
                                // variant="outlined"
                                variant="standard"
                                size="small"
                                sx={{ m: 1, minWidth: 220 }}
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  {labels.action}
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      // required
                                      disabled={isReassignByDocVer}
                                      label={labels.action}
                                      // sx={{ width: 300 }}
                                      value={field.value}
                                      onChange={(value) =>
                                        field.onChange(value)
                                      }
                                    >
                                      <MenuItem value="APPROVE">
                                        {language == "en" ? "Approve" : "मंजूर"}
                                      </MenuItem>
                                      <MenuItem value="REASSAIGN">
                                        {language == "en"
                                          ? "Reassign"
                                          : "पुन्हा नियुक्त करा"}
                                      </MenuItem>
                                    </Select>
                                  )}
                                  name="traineeAadharCardDocStatus"
                                  control={control}
                                  defaultValue=""
                                />
                              </FormControl>
                            </Grid>
                            <Grid
                              item
                              xl={4}
                              lg={4}
                              md={6}
                              sm={6}
                              xs={12}
                              p={1}
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <TextField
                                id="standard-basic"
                                variant="standard"
                                // variant="outlined"
                                size="small"
                                // required
                                label={labels.remark}
                                {...register("traineeAadharCardDocRemark")}
                                error={!!errors.traineeAadharCardDocRemark}
                                sx={{ width: 230 }}
                                disabled={isReassignByDocVer}
                                InputProps={{
                                  style: { fontSize: 18 },
                                  // readOnly: readonlyFields
                                }}
                                InputLabelProps={{ style: { fontSize: 15 } }}
                                helperText={
                                  errors?.traineeAadharCardDocRemark
                                    ? errors.traineeAadharCardDocRemark.message
                                    : null
                                }
                              />
                            </Grid>
                          </>
                        )}
                      </Grid>
                      {/*castCertificate */}
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
                          marginBottom: "15px",
                          paddingLeft: "80px",
                          paddingRight: "80px",
                        }}
                      >
                        <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                          {/* <label>{labels.castCertificate}</label> */}
                          <InputLabel
                          // required
                          // error={!!errors?.leavingCertificateDocument}
                          >
                            {labels.castCertificate}
                          </InputLabel>
                        </Grid>
                        <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                          {/* <UploadButton
                          view={docView}
                          appName="TP"
                          serviceName="PARTMAP"
                          fileUpdater={setCastCertificate}
                          filePath={castCertificate}
                        /> */}
                          {/* <DocumentsUpload
                            error={!!errors?.castCertificate}
                            appName="TP"
                            serviceName="PARTMAP"
                            fileDtl={watch("castCertificate")}
                            fileKey={"castCertificate"}
                            showDel={!props.onlyDoc ? true : false}
                            view={docView}
                          /> */}
                          <DocumentsUploadIti
                            error={!!errors?.castCertificate}
                            appName="TP"
                            serviceName="PARTMAP"
                            fileDtl={watch("castCertificate")}
                            fileKey={"castCertificate"}
                            showDel={!props.onlyDoc ? true : false}
                            view={docView}
                            fileNameEncrypted={(path) => {
                              setEncrptCastCert(path);
                            }}
                          />
                        </Grid>
                        {(authority?.includes("DOCUMENT_VERIFICATION") ||
                          isReassignByDocVer === true) && (
                          <>
                            <Grid
                              item
                              xl={4}
                              lg={4}
                              md={6}
                              sm={6}
                              xs={12}
                              p={1}
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <FormControl
                                // variant="outlined"
                                variant="standard"
                                size="small"
                                sx={{ m: 1, minWidth: 220 }}
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  {labels.action}
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      // required
                                      disabled={isReassignByDocVer}
                                      label={labels.action}
                                      // sx={{ width: 300 }}
                                      value={field.value}
                                      onChange={(value) =>
                                        field.onChange(value)
                                      }
                                    >
                                      <MenuItem value="APPROVE">
                                        {language == "en" ? "Approve" : "मंजूर"}
                                      </MenuItem>
                                      <MenuItem value="REASSAIGN">
                                        {language == "en"
                                          ? "Reassign"
                                          : "पुन्हा नियुक्त करा"}
                                      </MenuItem>
                                    </Select>
                                  )}
                                  name="castCertificateDocStatus"
                                  control={control}
                                  defaultValue=""
                                />
                              </FormControl>
                            </Grid>
                            <Grid
                              item
                              xl={4}
                              lg={4}
                              md={6}
                              sm={6}
                              xs={12}
                              p={1}
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <TextField
                                id="standard-basic"
                                variant="standard"
                                // variant="outlined"
                                size="small"
                                // required
                                label={labels.remark}
                                {...register("castCertificateDocRemark")}
                                error={!!errors.castCertificateDocRemark}
                                sx={{ width: 230 }}
                                disabled={isReassignByDocVer}
                                InputProps={{
                                  style: { fontSize: 18 },
                                  // readOnly: readonlyFields
                                }}
                                InputLabelProps={{ style: { fontSize: 15 } }}
                                helperText={
                                  errors?.castCertificateDocRemark
                                    ? errors.castCertificateDocRemark.message
                                    : null
                                }
                              />
                            </Grid>
                          </>
                        )}
                      </Grid>
                      {/* LeavingCertificateDocument */}
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
                          marginBottom: "15px",
                          paddingLeft: "80px",
                          paddingRight: "80px",
                        }}
                      >
                        <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                          {/* <label>{labels.traineeTc}</label> */}
                          <InputLabel
                            required
                            error={!!errors?.leavingCertificateDocument}
                          >
                            {labels.traineeTc}
                          </InputLabel>
                        </Grid>
                        <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                          {/* <UploadButton
                          error={!!errors?.leavingCertificateDocument}
                          view={docView}
                          appName="TP"
                          serviceName="PARTMAP"
                          fileUpdater={setLeavingCertificateDocument}
                          filePath={leavingCertificateDocument}
                        /> */}
                          {/* <DocumentsUpload
                            error={!!errors?.leavingCertificateDocument}
                            appName="TP"
                            serviceName="PARTMAP"
                            fileDtl={watch("leavingCertificateDocument")}
                            fileKey={"leavingCertificateDocument"}
                            showDel={!props.onlyDoc ? true : false}
                            view={docView}
                          /> */}
                          <DocumentsUploadIti
                            error={!!errors?.leavingCertificateDocument}
                            appName="TP"
                            serviceName="PARTMAP"
                            fileDtl={watch("leavingCertificateDocument")}
                            fileKey={"leavingCertificateDocument"}
                            showDel={!props.onlyDoc ? true : false}
                            view={docView}
                            fileNameEncrypted={(path) => {
                              setEncrptTraineeLC(path);
                            }}
                          />
                          <FormHelperText
                            error={!!errors?.leavingCertificateDocument}
                          >
                            {errors?.leavingCertificateDocument
                              ? labels?.leavingCertificateDocumentReq
                              : null}
                          </FormHelperText>
                        </Grid>
                        {(authority?.includes("DOCUMENT_VERIFICATION") ||
                          isReassignByDocVer === true) && (
                          <>
                            <Grid
                              item
                              xl={4}
                              lg={4}
                              md={6}
                              sm={6}
                              xs={12}
                              p={1}
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <FormControl
                                // variant="outlined"
                                variant="standard"
                                size="small"
                                sx={{ m: 1, minWidth: 220 }}
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  {labels.action}
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      // required
                                      disabled={isReassignByDocVer}
                                      label={labels.action}
                                      // sx={{ width: 300 }}
                                      value={field.value}
                                      onChange={(value) =>
                                        field.onChange(value)
                                      }
                                    >
                                      <MenuItem value="APPROVE">
                                        {language == "en" ? "Approve" : "मंजूर"}
                                      </MenuItem>
                                      <MenuItem value="REASSAIGN">
                                        {language == "en"
                                          ? "Reassign"
                                          : "पुन्हा नियुक्त करा"}
                                      </MenuItem>
                                    </Select>
                                  )}
                                  name="leavingCertificateDocStatus"
                                  control={control}
                                  defaultValue=""
                                />
                              </FormControl>
                            </Grid>
                            <Grid
                              item
                              xl={4}
                              lg={4}
                              md={6}
                              sm={6}
                              xs={12}
                              p={1}
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <TextField
                                id="standard-basic"
                                variant="standard"
                                // variant="outlined"
                                size="small"
                                // required
                                disabled={isReassignByDocVer}
                                label={labels.remark}
                                {...register("leavingCertificateDocRemark")}
                                error={!!errors.leavingCertificateDocRemark}
                                sx={{ width: 230 }}
                                InputProps={{
                                  style: { fontSize: 18 },
                                  // readOnly: readonlyFields
                                }}
                                InputLabelProps={{ style: { fontSize: 15 } }}
                                helperText={
                                  errors?.leavingCertificateDocRemark
                                    ? errors.leavingCertificateDocRemark.message
                                    : null
                                }
                              />
                            </Grid>
                          </>
                        )}
                      </Grid>
                      {/* LastYearMarksheet*/}
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
                          marginBottom: "15px",
                          paddingLeft: "80px",
                          paddingRight: "80px",
                        }}
                      >
                        <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                          {/* <label>{labels.traineeLastYrMarksheet}</label> */}
                          <InputLabel
                            required
                            error={!!errors?.lastYearMarksheet}
                          >
                            {labels.traineeLastYrMarksheet}
                          </InputLabel>
                        </Grid>
                        <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                          {/* <UploadButton
                          error={!!errors?.lastYearMarksheet}
                          view={docView}
                          appName="TP"
                          serviceName="PARTMAP"
                          fileUpdater={setLastYearMarksheet}
                          filePath={lastYearMarksheet}
                        /> */}
                          {/* <DocumentsUpload
                            error={!!errors?.lastYearMarksheet}
                            appName="TP"
                            serviceName="PARTMAP"
                            fileDtl={watch("lastYearMarksheet")}
                            fileKey={"lastYearMarksheet"}
                            showDel={!props.onlyDoc ? true : false}
                            view={docView}
                          /> */}
                          <DocumentsUploadIti
                            error={!!errors?.lastYearMarksheet}
                            appName="TP"
                            serviceName="PARTMAP"
                            fileDtl={watch("lastYearMarksheet")}
                            fileKey={"lastYearMarksheet"}
                            showDel={!props.onlyDoc ? true : false}
                            view={docView}
                            fileNameEncrypted={(path) => {
                              setEncrptTraineeLastYrMarksheet(path);
                            }}
                          />
                          <FormHelperText error={!!errors?.lastYearMarksheet}>
                            {errors?.lastYearMarksheet
                              ? labels?.lastYearMarksheetReq
                              : null}
                          </FormHelperText>
                        </Grid>
                        {(authority?.includes("DOCUMENT_VERIFICATION") ||
                          isReassignByDocVer === true) && (
                          <>
                            <Grid
                              item
                              xl={4}
                              lg={4}
                              md={6}
                              sm={6}
                              xs={12}
                              p={1}
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <FormControl
                                // variant="outlined"
                                variant="standard"
                                size="small"
                                sx={{ m: 1, minWidth: 220 }}
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  {labels.action}
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      // required
                                      disabled={isReassignByDocVer}
                                      label={labels.action}
                                      // sx={{ width: 300 }}
                                      value={field.value}
                                      onChange={(value) =>
                                        field.onChange(value)
                                      }
                                    >
                                      <MenuItem value="APPROVE">
                                        {language == "en" ? "Approve" : "मंजूर"}
                                      </MenuItem>
                                      <MenuItem value="REASSAIGN">
                                        {language == "en"
                                          ? "Reassign"
                                          : "पुन्हा नियुक्त करा"}
                                      </MenuItem>
                                    </Select>
                                  )}
                                  name="lastYearMarksheetDocStatus"
                                  control={control}
                                  defaultValue=""
                                />
                              </FormControl>
                            </Grid>
                            <Grid
                              item
                              xl={4}
                              lg={4}
                              md={6}
                              sm={6}
                              xs={12}
                              p={1}
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <TextField
                                id="standard-basic"
                                variant="standard"
                                // variant="outlined"
                                size="small"
                                disabled={isReassignByDocVer}
                                label={labels.remark}
                                {...register("lastYearMarksheetDocRemark")}
                                error={!!errors.lastYearMarksheetDocRemark}
                                sx={{ width: 230 }}
                                InputProps={{
                                  style: { fontSize: 18 },
                                  // readOnly: readonlyFields
                                }}
                                InputLabelProps={{ style: { fontSize: 15 } }}
                                helperText={
                                  errors?.lastYearMarksheetDocRemark
                                    ? errors.lastYearMarksheetDocRemark.message
                                    : null
                                }
                              />
                            </Grid>
                          </>
                        )}
                      </Grid>
                      {/* DvetAllotmentLetter*/}
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
                          marginBottom: "15px",
                          paddingLeft: "80px",
                          paddingRight: "80px",
                        }}
                      >
                        <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                          {/* <label>{labels.dvetItiAllotementLetter}</label> */}
                          <InputLabel
                            required
                            error={!!errors?.dvetAllotmentLetter}
                          >
                            {labels.dvetItiAllotementLetter}
                          </InputLabel>
                        </Grid>
                        <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                          {/* <UploadButton
                          error={!!errors?.dvetAllotmentLetter}
                          view={docView}
                          appName="TP"
                          serviceName="PARTMAP"
                          fileUpdater={setDvetAllotmentLetter}
                          filePath={dvetAllotmentLetter}
                        /> */}
                          {/* <DocumentsUpload
                            error={!!errors?.dvetAllotmentLetter}
                            appName="TP"
                            serviceName="PARTMAP"
                            fileDtl={watch("dvetAllotmentLetter")}
                            fileKey={"dvetAllotmentLetter"}
                            showDel={!props.onlyDoc ? true : false}
                            view={docView}
                          /> */}
                          <DocumentsUploadIti
                            error={!!errors?.dvetAllotmentLetter}
                            appName="TP"
                            serviceName="PARTMAP"
                            fileDtl={watch("dvetAllotmentLetter")}
                            fileKey={"dvetAllotmentLetter"}
                            showDel={!props.onlyDoc ? true : false}
                            view={docView}
                            fileNameEncrypted={(path) => {
                              setEncrptDvetAllotmentLetter(path);
                            }}
                          />
                          <FormHelperText error={!!errors?.dvetAllotmentLetter}>
                            {errors?.dvetAllotmentLetter
                              ? labels?.dvetAllotmentLetterReq
                              : null}
                          </FormHelperText>
                        </Grid>
                        {(authority?.includes("DOCUMENT_VERIFICATION") ||
                          isReassignByDocVer === true) && (
                          <>
                            <Grid
                              item
                              xl={4}
                              lg={4}
                              md={6}
                              sm={6}
                              xs={12}
                              p={1}
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <FormControl
                                // variant="outlined"
                                variant="standard"
                                size="small"
                                sx={{ m: 1, minWidth: 220 }}
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  {labels.action}
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      // required
                                      disabled={isReassignByDocVer}
                                      label={labels.action}
                                      // sx={{ width: 300 }}
                                      value={field.value}
                                      onChange={(value) =>
                                        field.onChange(value)
                                      }
                                    >
                                      <MenuItem value="APPROVE">
                                        {language == "en" ? "Approve" : "मंजूर"}
                                      </MenuItem>
                                      <MenuItem value="REASSAIGN">
                                        {language == "en"
                                          ? "Reassign"
                                          : "पुन्हा नियुक्त करा"}
                                      </MenuItem>
                                    </Select>
                                  )}
                                  name="dvetAllotmentLetterDocStatus"
                                  control={control}
                                  defaultValue=""
                                />
                              </FormControl>
                            </Grid>
                            <Grid
                              item
                              xl={4}
                              lg={4}
                              md={6}
                              sm={6}
                              xs={12}
                              p={1}
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <TextField
                                id="standard-basic"
                                variant="standard"
                                // variant="outlined"
                                size="small"
                                // required
                                disabled={isReassignByDocVer}
                                label={labels.remark}
                                {...register("dvetAllotmentLetterDocRemark")}
                                error={!!errors.dvetAllotmentLetterDocRemark}
                                sx={{ width: 230 }}
                                InputProps={{
                                  style: { fontSize: 18 },
                                  // readOnly: readonlyFields
                                }}
                                InputLabelProps={{ style: { fontSize: 15 } }}
                                helperText={
                                  errors?.dvetAllotmentLetterDocRemark
                                    ? errors.dvetAllotmentLetterDocRemark
                                        .message
                                    : null
                                }
                              />
                            </Grid>
                          </>
                        )}
                      </Grid>
                      {(casteCategoryForDocs === 11 ||
                        casteCategoryForDocs === 12 ||
                        casteCategoryForDocs === 17) && (
                        <>
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
                              marginBottom: "15px",
                              paddingLeft: "80px",
                              paddingRight: "80px",
                            }}
                          >
                            <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                              <label>{labels.nonCreamyLayer}</label>
                            </Grid>
                            <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                              {/* <UploadButton
                                view={docView}
                                appName="TP"
                                serviceName="PARTMAP"
                                fileUpdater={setNonCreamylayer}
                                filePath={nonCreamylayer}
                              /> */}
                              {/* <DocumentsUpload
                                // error={!!errors?.traineeAadharCardDocument}
                                appName="TP"
                                serviceName="PARTMAP"
                                fileDtl={watch("nonCreamylayer")}
                                fileKey={"nonCreamylayer"}
                                showDel={!props.onlyDoc ? true : false}
                                view={docView}
                              /> */}
                              <DocumentsUploadIti
                                error={!!errors?.nonCreamylayer}
                                appName="TP"
                                serviceName="PARTMAP"
                                fileDtl={watch("nonCreamylayer")}
                                fileKey={"nonCreamylayer"}
                                showDel={!props.onlyDoc ? true : false}
                                view={docView}
                                fileNameEncrypted={(path) => {
                                  setEncrptNonCreamylayer(path);
                                }}
                              />
                            </Grid>
                            {(authority?.includes("DOCUMENT_VERIFICATION") ||
                              isReassignByDocVer === true) && (
                              <>
                                <Grid
                                  item
                                  xl={4}
                                  lg={4}
                                  md={6}
                                  sm={6}
                                  xs={12}
                                  p={1}
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <FormControl
                                    // variant="outlined"
                                    variant="standard"
                                    size="small"
                                    sx={{ m: 1, minWidth: 220 }}
                                  >
                                    <InputLabel id="demo-simple-select-standard-label">
                                      {labels.action}
                                    </InputLabel>
                                    <Controller
                                      render={({ field }) => (
                                        <Select
                                          // required
                                          disabled={isReassignByDocVer}
                                          label={labels.action}
                                          // sx={{ width: 300 }}
                                          value={field.value}
                                          onChange={(value) =>
                                            field.onChange(value)
                                          }
                                        >
                                          <MenuItem value="APPROVE">
                                            {labels.approve}
                                          </MenuItem>
                                          <MenuItem value="REASSAIGN">
                                            Reassign
                                          </MenuItem>
                                        </Select>
                                      )}
                                      name="nonCreamylayerDocStatus"
                                      control={control}
                                      defaultValue=""
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid
                                  item
                                  xl={4}
                                  lg={4}
                                  md={6}
                                  sm={6}
                                  xs={12}
                                  p={1}
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <TextField
                                    // id="standard-basic"
                                    variant="standard"
                                    // variant="outlined"
                                    size="small"
                                    // required
                                    disabled={isReassignByDocVer}
                                    label={labels.remark}
                                    {...register("nonCreamylayerDocRemark")}
                                    error={!!errors.nonCreamylayerDocRemark}
                                    sx={{ width: 230 }}
                                    InputProps={{
                                      style: { fontSize: 18 },
                                      // readOnly: readonlyFields
                                    }}
                                    InputLabelProps={{
                                      style: { fontSize: 15 },
                                    }}
                                    helperText={
                                      errors?.nonCreamylayerDocRemark
                                        ? errors.nonCreamylayerDocRemark.message
                                        : null
                                    }
                                  />
                                </Grid>
                              </>
                            )}
                          </Grid>
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
                              marginBottom: "15px",
                              paddingLeft: "80px",
                              paddingRight: "80px",
                            }}
                          >
                            <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                              <label>{labels.incomeProof}</label>
                            </Grid>
                            <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                              {/* <UploadButton
                                view={docView}
                                appName="TP"
                                serviceName="PARTMAP"
                                fileUpdater={setIncomeProof}
                                filePath={incomeProof}
                              /> */}
                              {/* <DocumentsUpload
                                // error={!!errors?.traineeAadharCardDocument}
                                appName="TP"
                                serviceName="PARTMAP"
                                fileDtl={watch("incomeProof")}
                                fileKey={"incomeProof"}
                                showDel={!props.onlyDoc ? true : false}
                                view={docView}
                              /> */}
                              <DocumentsUploadIti
                                error={!!errors?.incomeProof}
                                appName="TP"
                                serviceName="PARTMAP"
                                fileDtl={watch("incomeProof")}
                                fileKey={"incomeProof"}
                                showDel={!props.onlyDoc ? true : false}
                                view={docView}
                                fileNameEncrypted={(path) => {
                                  setEncrptIncomeProof(path);
                                }}
                              />
                            </Grid>

                            {(authority?.includes("DOCUMENT_VERIFICATION") ||
                              isReassignByDocVer === true) && (
                              <>
                                <Grid
                                  item
                                  xl={4}
                                  lg={4}
                                  md={6}
                                  sm={6}
                                  xs={12}
                                  p={1}
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <FormControl
                                    // variant="outlined"
                                    variant="standard"
                                    size="small"
                                    sx={{ m: 1, minWidth: 220 }}
                                  >
                                    <InputLabel id="demo-simple-select-standard-label">
                                      {labels.action}
                                    </InputLabel>
                                    <Controller
                                      render={({ field }) => (
                                        <Select
                                          // required
                                          disabled={isReassignByDocVer}
                                          label={labels.action}
                                          // sx={{ width: 300 }}
                                          value={field.value}
                                          onChange={(value) =>
                                            field.onChange(value)
                                          }
                                        >
                                          <MenuItem value="APPROVE">
                                            {labels.approve}
                                          </MenuItem>
                                          <MenuItem value="REASSAIGN">
                                            Reassign
                                          </MenuItem>
                                        </Select>
                                      )}
                                      name="incomeProofDocStatus"
                                      control={control}
                                      defaultValue=""
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid
                                  item
                                  xl={4}
                                  lg={4}
                                  md={6}
                                  sm={6}
                                  xs={12}
                                  p={1}
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <TextField
                                    id="standard-basic"
                                    variant="standard"
                                    // variant="outlined"
                                    size="small"
                                    // required
                                    disabled={isReassignByDocVer}
                                    label={labels.remark}
                                    {...register("incomeProofDocRemark")}
                                    error={!!errors.incomeProofDocRemark}
                                    sx={{ width: 230 }}
                                    InputProps={{
                                      style: { fontSize: 18 },
                                      // readOnly: readonlyFields
                                    }}
                                    InputLabelProps={{
                                      style: { fontSize: 15 },
                                    }}
                                    helperText={
                                      errors?.incomeProofDocRemark
                                        ? errors.incomeProofDocRemark.message
                                        : null
                                    }
                                  />
                                </Grid>
                              </>
                            )}
                          </Grid>
                        </>
                      )}
                      {/* Buttons */}
                      <Divider />
                      {authority?.includes("ACCOUNTANT") && (
                        <>
                          {/* admissionFeeRs */}
                          <Grid
                            item
                            xl={4}
                            lg={4}
                            md={6}
                            sm={6}
                            xs={12}
                            p={1}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <TextField
                              id="standard-basic"
                              variant="standard"
                              // variant="outlined"
                              // label="Admission Fees Rs"
                              sx={{ width: 220 }}
                              label={
                                <span>
                                  {labels.admissionFees} &#x20B9; {"*"}
                                </span>
                              }
                              {...register("admissionFees")}
                              error={!!errors.admissionFees}
                              InputProps={{ style: { fontSize: 18 } }}
                              InputLabelProps={{
                                style: { fontSize: 15 },
                                shrink: watch("admissionFees") ? true : false,
                              }}
                              helperText={
                                errors?.admissionFees
                                  ? labels.admissionFeesReq
                                  : null
                              }
                            />
                          </Grid>
                          {/* deposit */}
                          <Grid
                            item
                            xl={4}
                            lg={4}
                            md={6}
                            sm={6}
                            xs={12}
                            p={1}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <TextField
                              id="standard-basic"
                              variant="standard"
                              // variant="outlined"
                              // label="Admission Fees Rs"
                              sx={{ width: 220 }}
                              label={
                                <span>
                                  {labels.cautionFees} &#x20B9; {"*"}
                                </span>
                              }
                              {...register("deposit")}
                              error={!!errors.deposit}
                              InputProps={{ style: { fontSize: 18 } }}
                              InputLabelProps={{
                                style: { fontSize: 15 },
                                shrink: watch("deposit") ? true : false,
                              }}
                              helperText={
                                errors?.deposit ? labels.depositReq : null
                              }
                            />
                          </Grid>
                          {/* totalAdmissionFeeRs */}
                          <Grid
                            item
                            xl={4}
                            lg={4}
                            md={6}
                            sm={6}
                            xs={12}
                            p={1}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <TextField
                              id="standard-basic"
                              variant="standard"
                              // variant="outlined"

                              // label="Admission Fees Rs"
                              sx={{ width: 220 }}
                              label={
                                <span>
                                  {labels.totalAdmissionFees} &#x20B9; {"*"}{" "}
                                </span>
                              }
                              {...register("totalAdmissionFeeRs")}
                              error={!!errors.totalAdmissionFeeRs}
                              InputProps={{ style: { fontSize: 18 } }}
                              InputLabelProps={{
                                style: { fontSize: 15 },
                                shrink: watch("totalAdmissionFeeRs")
                                  ? true
                                  : false,
                              }}
                              helperText={
                                errors?.totalAdmissionFeeRs
                                  ? labels.totalAdmissionFeeRsReq
                                  : null
                              }
                            />
                          </Grid>
                          {/* admissionFeeAmountToPay */}
                          <Grid
                            item
                            xl={4}
                            lg={4}
                            md={6}
                            sm={6}
                            xs={12}
                            p={1}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <TextField
                              id="standard-basic"
                              variant="standard"
                              sx={{ width: 220 }}
                              // variant="outlined"
                              // required
                              // label="Admission Fees Rs"
                              label={
                                <span>
                                  {labels.feesAmountToPay}&#x20B9; {"*"}{" "}
                                </span>
                              }
                              {...register("admissionFeeAmountToPay")}
                              // onChange={(e) =>
                              //   console.log("event", e.target.value)
                              // }
                              error={!!errors.admissionFeeAmountToPay}
                              InputProps={{ style: { fontSize: 18 } }}
                              InputLabelProps={{
                                style: { fontSize: 15 },
                                shrink: watch("admissionFeeAmountToPay")
                                  ? true
                                  : false,
                              }}
                              helperText={
                                errors?.admissionFeeAmountToPay
                                  ? labels.admissionFeeAmountToPayReq
                                  : null
                              }
                            />
                          </Grid>
                          {/* remainingFeesAmount */}
                          <Grid
                            item
                            xl={4}
                            lg={4}
                            md={6}
                            sm={6}
                            xs={12}
                            p={1}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <TextField
                              id="standard-basic"
                              variant="standard"
                              // variant="outlined"

                              // label="Admission Fees Rs"
                              sx={{ width: 220 }}
                              label={
                                <span>
                                  {labels.remainingFeesAmount} &#x20B9;
                                </span>
                              }
                              {...register("remainingFeesAmount")}
                              error={!!errors.remainingFeesAmount}
                              InputProps={{ style: { fontSize: 18 } }}
                              InputLabelProps={{
                                style: { fontSize: 15 },
                                shrink: true,
                              }}
                              helperText={
                                errors?.remainingFeesAmount
                                  ? labels.remainingFeesAmountReq
                                  : null
                              }
                            />
                          </Grid>
                          {/* paymentTypeKey */}
                          <Grid
                            item
                            xl={4}
                            lg={4}
                            md={6}
                            sm={6}
                            xs={12}
                            p={1}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <FormControl sx={{ width: 245 }}>
                              <InputLabel
                                required
                                error={!!errors.paymentTypeKey}
                              >
                                {labels.paymentType}
                              </InputLabel>
                              <Controller
                                control={control}
                                name="paymentTypeKey"
                                // rules={{ required: true }}
                                defaultValue=""
                                render={({ field }) => (
                                  <Select
                                    label={labels.paymentType}
                                    // variant="outlined"
                                    variant="standard"
                                    {...field}
                                    error={!!errors.paymentTypeKey}
                                  >
                                    {paymentTypes &&
                                      paymentTypes.map((paymentType) => (
                                        <MenuItem
                                          key={paymentType.id}
                                          value={paymentType.id}
                                        >
                                          {language == "en"
                                            ? paymentType?.paymentType
                                            : paymentType?.paymentTypeMr}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                              />
                              <FormHelperText error={!!errors.paymentTypeKey}>
                                {errors?.paymentTypeKey
                                  ? labels.paymentTypeKeyReq
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          {/* paymentModeKey */}
                          <Grid
                            item
                            xl={4}
                            lg={4}
                            md={6}
                            sm={6}
                            xs={12}
                            p={1}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <FormControl sx={{ width: 245 }}>
                              <InputLabel
                                required
                                error={!!errors.paymentModeKey}
                              >
                                {labels.paymentMode}
                              </InputLabel>
                              <Controller
                                control={control}
                                name="paymentModeKey"
                                rules={{ required: true }}
                                defaultValue=""
                                render={({ field }) => (
                                  <Select
                                    label={labels.paymentMode}
                                    // variant="outlined"
                                    variant="standard"
                                    {...field}
                                    error={!!errors.paymentModeKey}
                                  >
                                    {paymentModes &&
                                      paymentModes.map((paymentMode) => (
                                        <MenuItem
                                          key={paymentMode.id}
                                          value={paymentMode.id}
                                        >
                                          {language == "en"
                                            ? paymentMode?.paymentMode
                                            : paymentMode?.paymentModeMr}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                              />
                              <FormHelperText error={!!errors.paymentModeKey}>
                                {errors?.paymentModeKey
                                  ? labels.paymentModeKeyReq
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          <Divider />
                        </>
                      )}

                      {/* approve or reassign buttons for all users except the entry clerk */}
                      {authority?.includes("ENTRY") ||
                      authority?.includes("ACCOUNTANT") ? (
                        <></>
                      ) : (
                        <>
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
                            }}
                          >
                            <FormControl
                              // variant="outlined"
                              variant="standard"
                              // size="small"
                              // sx={{ m: 1, minWidth: 120 }}
                            >
                              <InputLabel
                                shrink={true}
                                id="demo-simple-select-standard-label"
                                error={!!errors.action}
                              >
                                {`${labels.action} *`}
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    // required
                                    disabled={rejectApplViewBtn}
                                    label={labels.action}
                                    sx={{ width: 230 }}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                  >
                                    <MenuItem value="APPROVE">
                                      {language == "en" ? "Approve" : "मंजूर"}
                                    </MenuItem>
                                    <MenuItem value="REASSAIGN">
                                      {language == "en"
                                        ? "Reassign"
                                        : "पुन्हा नियुक्त करा"}
                                    </MenuItem>
                                  </Select>
                                )}
                                name="action"
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText error={!!errors.action}>
                                {errors?.action ? labels.actionReq : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                        </>
                      )}
                      {/* docs verification clerk remark */}
                      {(authority?.includes("DOCUMENT_VERIFICATION") ||
                        isReassignByDocVer === true) && (
                        <Grid
                          item
                          xl={6}
                          lg={6}
                          md={6}
                          sm={6}
                          xs={12}
                          p={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            // variant="outlined"
                            variant="standard"
                            label={labels.docsRemark}
                            {...register("docVerificationClerkRemark")}
                            // error={!!errors.principalRemarksEn}
                            sx={{ width: 230 }}
                            disabled={isReassignByDocVer}
                            InputProps={{
                              style: { fontSize: 18 },
                              // readOnly: readonlyFields
                            }}
                            InputLabelProps={{ style: { fontSize: 15 } }}
                            // helperText={errors?.bankAdderess ? errors.bankAdderess.message : null}
                          />
                        </Grid>
                      )}
                      {(authority?.includes("APPROVAL") ||
                        isReassignByPrincipal === true) && (
                        <Grid
                          item
                          xl={6}
                          lg={6}
                          md={6}
                          sm={6}
                          xs={12}
                          p={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            // variant="outlined"
                            variant="standard"
                            label="Principal Remark"
                            {...register("principalRemarksEn")}
                            // error={!!errors.principalRemarksEn}
                            sx={{ width: 230 }}
                            disabled={isReassignByPrincipal}
                            InputProps={{
                              style: { fontSize: 18 },
                              // readOnly: readonlyFields
                            }}
                            InputLabelProps={{ style: { fontSize: 15 } }}
                            // helperText={errors?.bankAdderess ? errors.bankAdderess.message : null}
                          />
                        </Grid>
                      )}
                      {authority?.includes("ACCOUNTANT") && (
                        <Grid
                          item
                          xl={6}
                          lg={6}
                          md={6}
                          sm={6}
                          xs={12}
                          p={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            // variant="outlined"
                            variant="standard"
                            label={labels.accountantRemarks}
                            {...register("accountantRemarks")}
                            error={!!errors.accountantRemarks}
                            sx={{ width: 500 }}
                            // disabled={isReassignByPrincipal}
                            InputProps={{
                              style: { fontSize: 18 },
                              // readOnly: readonlyFields
                            }}
                            InputLabelProps={{ style: { fontSize: 15 } }}
                            helperText={
                              errors?.accountantRemarks
                                ? labels.accountantRemarksReq
                                : null
                            }
                          />
                        </Grid>
                      )}

                      <Grid
                        container
                        spacing={5}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          paddingTop: "10px",
                          marginTop: "20px",
                        }}
                      >
                        <Grid item>
                          <Button
                            disabled={rejectApplViewBtn}
                            sx={{ marginRight: 8 }}
                            type="submit"
                            variant="contained"
                            color="primary"
                            endIcon={<SaveIcon />}
                          >
                            {labels.submit}
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            sx={{ marginRight: 8 }}
                            // disabled={rejectApplViewBtn}
                            disabled={
                              authority?.includes("ENTRY") ? false : true
                            }
                            variant="contained"
                            color="primary"
                            endIcon={<ClearIcon />}
                            onClick={() => cancellButton()}
                          >
                            {labels.clear}
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            variant="contained"
                            color="primary"
                            endIcon={<ExitToAppIcon />}
                            onClick={() => {
                              exitButton(), setRejectApplViewBtn(false);
                              setIsReassignByDocVer(false);
                              setIsReassignByPrincipal(false);
                              setDocView(false);
                              setIsFeesSection(false);
                            }}
                          >
                            {labels.exit}
                          </Button>
                        </Grid>
                      </Grid>

                      <Divider />
                    </Grid>
                  </Slide>
                )}
              </form>
            </FormProvider>
          </Box>
        </Box>
        {(authority?.includes("ADMIN_OFFICER") ||
          authority?.includes("ENTRY")) && (
          <div className={styles.addbtn}>
            <Button
              variant="contained"
              endIcon={<AddIcon />}
              type="primary"
              disabled={buttonInputState}
              onClick={() => {
                reset({
                  ...resetValuesExit,
                });
                setEditButtonInputState(true);
                setDataValidation(itiTraineeAdmissionSchema);
                setBtnSaveText("Save");
                setButtonInputState(true);
                setSlideChecked(true);
                setIsReassignByDocVer(false);
                setIsReassignByPrincipal(false);
                setIsOpenCollapse(!isOpenCollapse);
                setReadonlyFields(false);
                setShowTable(false);
              }}
            >
              {labels.add}
            </Button>
          </div>
        )}
        <Box>
          {loading ? (
            <Loader />
          ) : (
            <>
              {showTable && (
                <DataGrid
                  components={{ Toolbar: GridToolbar }}
                  componentsProps={{
                    toolbar: {
                      showQuickFilter: true,
                      quickFilterProps: { debounceMs: 500 },
                      // printOptions: { disableToolbarButton: true },
                      // disableExport: true,
                      // disableToolbarButton: true,
                      // csvOptions: { disableToolbarButton: true },
                    },
                  }}
                  headerName="Water"
                  getRowId={(row) => row.srNo}
                  autoHeight
                  sx={{
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
                  density="compact"
                  // density="comfortable"
                  // rows={studentList}
                  // columns={columns}
                  pagination
                  paginationMode="server"
                  // loading={data.loading}
                  rowCount={data.totalRows}
                  rowsPerPageOptions={data.rowsPerPageOptions}
                  page={data.page}
                  pageSize={data.pageSize}
                  rows={data.rows}
                  columns={columns}
                  onPageChange={(_data) => {
                    getItiStudentAdmission(data.pageSize, _data);
                  }}
                  onPageSizeChange={(_data) => {
                    console.log("222", _data);
                    // updateData("page", 1);
                    getItiStudentAdmission(_data, data.page);
                  }}
                />
              )}
            </>
          )}
        </Box>
      </Paper>
    </>
  );
};

export default Index;
