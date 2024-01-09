import { ThemeProvider } from "@emotion/react";
import { yupResolver } from "@hookform/resolvers/yup";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import swal from "sweetalert";

import styles from "../../../../../components/lms/styles/NewMembershipRegistration.module.css";
import UploadButton from "../../../../../components/marriageRegistration/DocumentUploadLms";
// import boardschema from '../../../../components/marriageRegistration/schema/boardschema'
import { newMembershipSchema } from "../../../../../components/lms/schema/newMembershipSchema";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../../theme";
import urls from "../../../../../URLS/urls";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
// import NewMembershipRegistration from './newMembershipRegistration'
import moment from "moment";
import Preview from "../../../../../components/lms/Preview";
// import BoardRegistration from '../../../transactions/boardRegistrations/citizen/boardRegistration'
import Transliteration from "../../../../../components/common/linguosol/transliteration";
import Loader from "../../../../../containers/Layout/components/Loader";
import LmsHeader from "../../../../../components/lms/lmsHeader";
import BreadcrumbComponent from "../../../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../../../util/util";
import { DecryptData } from "../../../../../components/common/EncryptDecrypt";

const Index = (props) => {
  let appName = "LMS";
  let serviceName = "N-LMS";
  let applicationFrom = "Web";
  const user = useSelector((state) => state?.user.user);
  const language = useSelector((state) => state?.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const [librarryType, setLibrarryType] = useState("");

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(newMembershipSchema(language, librarryType)),
    // resolver: yupResolver(newMembershipSchema(language)),
    mode: "onChange",
    defaultValues: {
      id: null,
    },
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    setError,
    getValues,
    clearErrors,
    formState: { errors },
  } = methods;
  const [btnSaveText, setBtnSaveText] = useState("save");

  const router = useRouter();
  const [atitles, setatitles] = useState([]);
  const [pageMode, setPageMode] = useState(null);

  const [disable, setDisable] = useState(false);
  const [formPreviewDailog, setFormPreviewDailog] = useState(false);
  const formPreviewDailogOpen = () => setFormPreviewDailog(true);
  const formPreviewDailogClose = () => setFormPreviewDailog(false);
  // const [zoneKeys, setZoneKeys] = useState([])
  const [libraryKeys, setLibraryKeys] = useState([]);
  const [membershipMonthsKeys, setMembershipMonthsKeys] = useState([]);
  const [isCompi, setIsCompi] = useState(false);
  const [referenceMobileNo, setReferenceMobileNo] = useState();
  const [generateOTP, setGenerateOTP] = useState(false);
  const [usernameVerify, setUsernameVerify] = useState();
  const [citizenOTP, setCitizenOTP] = useState();
  const [verifyOTP, setOTPVerified] = useState(false);
  const [witnessId, setWitnessId] = useState();
  const [encryptedFileNameToSend, setEncryptedFileNameToSend] = useState();
  const [encryptedAadharCardDoc1, setEncryptedAadharCardDoc1] = useState("");
  const [encryptedAadharCardDoc, setEncryptedAadharCardDoc] = useState("");
  const [encryptedPhotoAttachment, setEncryptedPhotoAttachment] = useState("");
  const [encryptedTaxReceipt, setEncryptedTaxReceipt] = useState("");
  const [encryptedEducationDoc, setEncryptedEducationDoc] = useState("");
  const [allData, setAllData] = useState();

  const [lastbtnMode, setLastbtnMode] = useState(false);

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

  const membershipMonthsLibrary = [
    {
      months: 6,
      label: "6 Months",
    },
    {
      months: 12,
      label: "12 Months",
    },
  ];

  const membershipMonthsCompetetive = [
    {
      months: 24,
      label: "24 Months",
    },
  ];
  const libraryTypes = [
    {
      id: 1,
      value: "L",
      libraryName: "Library",
      libraryNameMr: "लायब्ररी",
    },
    {
      id: 2,
      value: "C",
      libraryName: "Competitive Study Centre",
      libraryNameMr: "स्पर्धात्मक अभ्यास केंद्र",
    },
  ];
  const [loading, setLoading] = useState(false);
  const [educationList, setEducationList] = useState([
    { id: 1, nameEn: "Below 10th Class" },
    { id: 2, nameEn: "10th Class" },
    // { id: 3, nameEn: "11th" },
    { id: 3, nameEn: "12th Class" },
    { id: 4, nameEn: "Graduation" },
    { id: 5, nameEn: "Post Graduation" },
    // { id: 7, nameEn: "Under Graduation" },
    // { id: 8, nameEn: "PHD" },
    // { id: 9, nameEn: "Doctor" },
  ]);

  useEffect(() => {
    setValue("applicationDate", new Date());
    if (router?.query?.disabled) {
      setDisable(router?.query?.disabled);
    }

    if (props?.id) {
      setLoading(true);
      axios
        .get(
          `${
            urls.LMSURL
          }/trnApplyForNewMembership/getAllByServiceId?serviceId=${85}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setLoading(false);
          console.log(res, "reg123");

          let _res = res.data.trnApplyForNewMembershipList.find((r, i) => {
            if (r.id == props.id) {
              // console.log("abc1234", r, props.id);
              return {
                srNo: i + 1,
                ...r,
              };
            }
          });
          reset(_res);
          setAllData(_res);
          // const aadharCardDocVar = DecryptData(
          //   "passphraseaaaaaaaaupload",
          //   _res.aadharCardDoc
          //   );
          //   setValue("aadharCardDoc",aadharCardDocVar)
          // console.log(aadharCardDocVar, "_resif");
          setBtnSaveText("update");
          // setValue('libraryKey', libraryKeys.find((library) => library.id == _res.libraryKey)?.libraryName)
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
        });
    } else if (router?.query?.id) {
      setLoading(true);
      axios
        .get(
          `${
            urls.LMSURL
          }/trnApplyForNewMembership/getAllByServiceId?serviceId=${85}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          // console.log(res, "reg123");
          setLoading(false);
          let _res = res.data.trnApplyForNewMembershipList.find((r, i) => {
            if (r.id == router?.query?.id) {
              // console.log("abc123", r.id, props.id);
              return {
                srNo: i + 1,
                ...r,
              };
            }
          });
          console.log(_res, "_reselse");
          reset(_res);
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
        });
    }
  }, [libraryKeys]);
  // useEffect(()=>{
  //   if(allData){
  //   const aadharCardDocVar = DecryptData(
  //     "passphraseaaaaaaaaupload",
  //     allData?.aadharCardDoc
  //     );
  //     setValue("aadharCardDoc",aadharCardDocVar)
  //     console.log("getval",aadharCardDocVar,watch("aadharCardDoc"));}
  // },[allData])
  useEffect(() => {
    console.log(
      "aala re",
      watch("libraryType"),
      // watch("membershipMonths"),
      membershipMonthsKeys
    );
    setLibrarryType(watch("libraryType"));
  }, [watch("libraryType")]);

  const onSubmitForm = (data) => {
    // OTP for Library not for competitive -- condition
    // if (watch("libraryType") === "L" && verifyOTP === false) {
    //   sweetAlert({
    //     title: language === "en" ? "Verification !!!" : "सत्यापन !!!",
    //     text:
    //       language === "en"
    //         ? "Please verify the witness mobile number !!"
    //         : "कृपया साक्षीदाराच्या मोबाईल नंबरची पडताळणी करा !!",
    //     icon: "error",
    //     button: language === "en" ? "Ok" : "ठीक आहे",
    //   });
    // } else {

    let userType;

    if (localStorage.getItem("loggedInUser") == "citizenUser") {
      userType = 1;
    } else if (localStorage.getItem("loggedInUser") == "departmentUser") {
      userType = 3;
    } else {
      userType = 2;
    }

    const bodyForApi = {
      ...data,
      createdUserId: user?.id,
      applicationFrom,
      // serviceCharges: null,
      serviceId: 85,
      applicationStatus: "APPLICATION_CREATED",
      libraryMembershipReferenceId: witnessId,
      applicantType: userType,
      aadharCardDoc1: encryptedAadharCardDoc1,
      aadharCardDoc: encryptedAadharCardDoc,
      photoAttachment: encryptedPhotoAttachment,
      taxReceipt: encryptedTaxReceipt,
      educationDoc: encryptedEducationDoc,
      // referenceMobileNo: referenceMobileNo
      // validityOfMarriageBoardRegistration,
    };
    console.log("Final Data: ", bodyForApi);

    // Save - DB
    if (btnSaveText === "save") {
      // OTP for Library not for competitive -- condition
      // if (watch("libraryType") === "L" && verifyOTP === false) {
      //   sweetAlert({
      //     title: language === "en" ? "Verification !!!" : "सत्यापन !!!",
      //     text:
      //       language === "en"
      //         ? "Please verify the witness mobile number !!"
      //         : "कृपया साक्षीदाराच्या मोबाईल नंबरची पडताळणी करा !!",
      //     icon: "error",
      //     button: language === "en" ? "Ok" : "ठीक आहे",
      //   });
      // } else {
      setLoading(true);
      axios
        .post(`${urls.LMSURL}/trnApplyForNewMembership/save`, bodyForApi, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("_res", res);
          if (res.status == 201) {
            if (res?.data?.status === "Success") {
              setLoading(false);
              sweetAlert({
                title: language === "en" ? "Saved " : "जतन केले",
                text:
                  language === "en"
                    ? "Record saved successfully"
                    : "रेकॉर्ड यशस्वीरित्या जतन केले",
                icon: "success",
                button: language === "en" ? "Ok" : "ठीक आहे",
                dangerMode: false,
                closeOnClickOutside: false,
              }).then((will) => {
                if (will) {
                  let temp = res?.data?.message;
                  let splitTemp = temp?.split(":")[1];
                  router.push({
                    pathname:
                      "/lms/transactions/newMembershipRegistration/acknowledgmentReceipt",
                    query: {
                      id: splitTemp,
                      applicantType: userType,
                    },
                  });
                }
              });
            } else {
              setLoading(false);
              sweetAlert({
                title: language === "en" ? "Failure " : "अयशस्वी",
                text:
                  language === "en" ? res?.data?.message : res?.data?.message,
                icon: "error",
                button: language === "en" ? "Ok" : "ठीक आहे",
                dangerMode: false,
                // closeOnClickOutside: false,
              });
            }
          }
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
        });
      // ---------------old based on status code- commetd on 27 Dec 3:45 pm by vishal-------------------------------
      // if (res.status == 201) {
      //   setLoading(false);
      //   // sweetAlert({
      //   //   title: "Saved",
      //   //   text: "Record saved successfully",
      //   //   icon: "success",
      //   //   // buttons: ["Ok"],
      //   // dangerMode: false,
      //   // closeOnClickOutside: false,
      //   // }).then((will) => {
      //   sweetAlert({
      //     title: language === "en" ? "Saved " : "जतन केले",
      //     text:
      //       language === "en"
      //         ? "Record saved successfully"
      //         : "रेकॉर्ड यशस्वीरित्या जतन केले",
      //     icon: "success",
      //     button: language === "en" ? "Ok" : "ठीक आहे",
      //     dangerMode: false,
      //     closeOnClickOutside: false,
      //   }).then((will) => {
      //     if (will) {
      //       let temp = res?.data?.message;
      //       let splitTemp = temp?.split(":")[1];
      //       router.push({
      //         pathname:
      //           "/lms/transactions/newMembershipRegistration/acknowledgmentReceipt",
      //         query: {
      //           id: splitTemp,
      //           applicantType: userType,
      //         },
      //       });
      //     }
      //   });
      // }
      // })
      // .catch((err) => {
      //   setLoading(false);
      //   console.log("__err123", err);
      //   if (err.response?.data?.status == 409) {
      //     // swal(
      //     //   "Error!",
      //     //   "Application for this member already exist!",
      //     //   "error"
      //     // );
      //     sweetAlert({
      //       title: language === "en" ? "Error !! " : "त्रुटी !!",
      //       text:
      //         language === "en"
      //           ? `Application for this member already exist ${
      //               err?.response?.data?.message
      //                 ? `in ${err?.response?.data?.message}`
      //                 : ""
      //             } !!`
      //           : `${
      //               err?.response?.data?.message
      //                 ? ` ${err?.response?.data?.message} या लायब्ररीमध्ये`
      //                 : ""
      //             } या सदस्याचा अर्ज आधीच अस्तित्वात आहे`,
      //       icon: "error",
      //       button: language === "en" ? "Ok" : "ठीक आहे",
      //     });
      //   } else {
      //     // swal("Error!", "Somethings Wrong Record not Saved!", "error");
      //     sweetAlert({
      //       title: language === "en" ? "Error !! " : "त्रुटी !!",
      //       text:
      //         language === "en"
      //           ? "Somethings Wrong !! Record not Saved!"
      //           : "काहीतरी त्रुटी !! रेकॉर्ड जतन केलेले नाही!",
      //       icon: "error",
      //       button: language === "en" ? "Ok" : "ठीक आहे",
      //     });
      //   }
      // });
      // ------------------------------------------------------------------------
      // }
    } else if (router.query.pageMode === "Edit") {
      axios
        .post(`${urls.LMSURL}/trnApplyForNewMembership/save`, bodyForApi, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            setLoading(false);
            // swal("Updated!", "Record Updated successfully !", "success");
            sweetAlert({
              title: language === "en" ? "Updated " : "अपडेट केले",
              text:
                language === "en"
                  ? "Record Updated successfully !"
                  : "रेकॉर्ड यशस्वीरीत्या अपडेट केले!",
              icon: "success",
              button: language === "en" ? "Ok" : "ठीक आहे",
            });
          }
          router.push(`/dashboard`);
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
        });
    }
    // }
  };

  // useEffect(() => {
  //     // if (router.query.pageMode == 'Edit' || router.query.pageMode == 'View') {
  //     if (router.query.pageMode !== 'Add' || router.query.pageMode !== 'Edit') {
  //         if (router?.query?.id) {
  //             axios
  //                 .get(
  //                     `${urls.MR}/transaction/marriageBoardRegistration/getapplicantById?applicationId=${router?.query?.id}`,
  //                 )
  //                 .then((resp) => {
  //                     console.log('board data', resp.data)
  //                     reset(resp.data)
  //                 })
  //                 .catch((err) => {
  //                     swal('Error!', 'Somethings Wrong Record not Found!', 'error')
  //                 })
  //         }
  //     }
  // }, [])

  useEffect(() => {
    if (watch("zoneKey") && watch("libraryType")) {
      getLibraryKeys();
    }
  }, [watch("zoneKey"), watch("libraryType")]);

  const getLibraryKeys = () => {
    //setValues("setBackDrop", true);
    if (watch("zoneKey")) {
      axios
        .get(
          `${urls.LMSURL}/libraryMaster/getLibraryByZoneKey?zoneKey=${watch(
            "zoneKey"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((r) => {
          // setLibraryKeys(
          //   r.data.libraryMasterList.map((row) => ({
          //     id: row.id,
          //     // zoneName: row.zoneName,
          //     // zoneNameMr: row.zoneNameMr,
          //     libraryName: row.libraryName,
          //     libraryNameMr: row.libraryNameMr,
          //     libraryType: row.libraryType,
          //   }))
          // );
          let _filterLib = r?.data?.libraryMasterList
            ?.map((row) => ({
              id: row.id,
              libraryName: row.libraryName,
              libraryNameMr: row.libraryNameMr,
              libraryType: row.libraryType,
            }))
            ?.filter((obj) => obj?.libraryType === watch("libraryType"));
          console.log("_filterLib", _filterLib);
          setLibraryKeys(_filterLib ?? []);
        })
        .catch((error) => {
          // setLoading(false);
          callCatchMethod(error, language);
        });
    }
  };

  const [zoneKeys, setZoneKeys] = useState([]);
  // getZoneKeys
  const getZoneKeys = () => {
    //setValues("setBackDrop", true);
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setZoneKeys(
          r.data.zone.map((row) => ({
            id: row.id,
            zoneName: row.zoneName,
            zoneNameMr: row.zoneNameMr,
          }))
        );
      })
      .catch((error) => {
        // setLoading(false);
        callCatchMethod(error, language);
      });
  };

  // genders
  // const [genderKeys, setgenderKeys] = useState([])

  // // getgenderKeys
  // const getgenderKeys = () => {
  //     axios
  //         .get(`${urls.CFCURL}/master/gender/getAll`)
  //         .then((r) => {
  //             setgenderKeys(
  //                 r.data.gender.map((row) => ({
  //                     id: row.id,
  //                     gender: row.gender,
  //                     genderMr: row.genderMr,
  //                 })),
  //             )
  //         })
  //         .catch((err) => {
  //             swal('Error!', 'Somethings Wrong Gender keys not Found!', 'error')
  //         })
  // }

  useEffect(() => {
    getLibraryKeys();
    getTitles();
    getTitleMr();
    getZoneKeys();
  }, []);

  useEffect(() => {
    //   if (getValues("libraryKey")) {
    //     let temp = libraryKeys?.find(
    //       (library) => library.id == watch("libraryKey")
    //     )?.libraryType;
    //     console.log("aala re1", temp);
    //     if (temp == "L") {
    //       console.log("aala re11");
    //       setMembershipMonthsKeys(membershipMonthsLibrary);
    //       setIsCompi(false);
    //     } else {
    //       console.log("aala re111");
    //       setMembershipMonthsKeys(membershipMonthsCompetetive);
    //       setIsCompi(true);
    //     }
    //   }
    // }, [getValues("libraryKey"), libraryKeys]);
    if (getValues("libraryType")) {
      let temp = watch("libraryType");
      if (temp == "L") {
        console.log("aala re11");
        setMembershipMonthsKeys(membershipMonthsLibrary);
        setIsCompi(false);
      } else {
        console.log("aala re111");
        setMembershipMonthsKeys(membershipMonthsCompetetive);
        setIsCompi(true);
      }
    }
  }, [getValues("libraryType")]);

  useEffect(() => {
    // if (router.query.pageMode === 'EDIT' || router.query.pageMode === 'View') {
    //   reset(router.query)
    // }
    console.log("user123", user);
    setValue("atitle", user.title);
    setValue("atitlemr", user.title);
    setValue("afName", user.firstName);
    setValue("amName", user.middleName);
    setValue("alName", user.surname);
    setValue("afNameMr", user.firstNamemr);
    setValue("amNameMr", user.middleNamemr);
    setValue("alNameMr", user.surnamemr);
    setValue("genderKey", user.gender);
    // setValue('', user.emailID)
    // setValue('mobile', user.mobile)

    setValue("aflatBuildingNo", user.cflatBuildingNo);
    setValue("abuildingName", user.cbuildingName);
    setValue("aroadName", user.croadName);
    setValue("alandmark", user.clandmark);
    setValue("apincode", user.cpinCode);
    setValue("acityName", user.ccity);
    setValue("astate", "Maharashtra");

    setValue("aflatBuildingNoMr", user.cflatBuildingNoMr);
    setValue("abuildingNameMr", user.cbuildingNameMr);
    setValue("aroadNameMr", user.croadNameMr);
    setValue("alandmarkMr", user.clandmarkMr);
    setValue("acityNameMr", user.ccityMr);
    setValue("astateMr", "महाराष्ट्र");
    setValue("aemail", user.emailID);
    setValue("amobileNo", user.mobile);
  }, [user]);

  const resetValuesCancell = {
    id: null,
    afName: "",
    amName: "",
    alName: "",
    afNameMr: "",
    amNameMr: "",
    alNameMr: "",
    aflatBuildingNo: "",
    abuildingName: "",
    aroadName: "",
    alandmark: "",
    acityName: "",
    astate: "",
    aflatBuildingNoMr: "",
    abuildingNameMr: "",
    aroadNameMr: "",
    alandmarkMr: "",
    acityNameMr: "",
    astateMr: "",
    apincode: null,
    amobileNo: null,
    aemail: "",
    aadharNo: "",
    atitle: null,
    atitlemr: null,
    applicationDate: null,
    genderKey: null,
    createdUserId: null,
    applicationFrom: "",
    // membershipMonths: "",
    educationDoc: "",
    photoAttachment: "",
    taxReceipt: "",
    aadharCardDoc1: "",
    aadharCardDoc: "",
    referenceMobileNo: "",
  };

  const cancellButton = () => {
    console.log("Clear");
    reset({
      ...resetValuesCancell,
    });
    setLibraryKeys([]);
    // let file1 = document.getElementById('docLms');
    // file1.value = "";
    setValue("aadharCardDoc1", null);
    setValue("aadharCardDoc", null);
    setValue("photoAttachment", null);
    setValue("taxReceipt", null);
    setValue("educationDoc", null);
  };

  const getTitles = async () => {
    await axios
      .get(`${urls.BaseURL}/title/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setatitles(
          r.data.title.map((row) => ({
            id: row.id,
            atitle: row.title,
            // titlemr: row.titlemr,
          }))
        );
      })
      .catch((error) => {
        // setLoading(false);
        callCatchMethod(error, language);
      });
  };
  const [TitleMrs, setTitleMrs] = useState([]);
  const getTitleMr = async () => {
    await axios
      .get(`${urls.BaseURL}/title/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setTitleMrs(
          r.data.title.map((row) => ({
            id: row.id,
            atitlemr: row.titleMr,
          }))
        );
      })
      .catch((error) => {
        // setLoading(false);
        callCatchMethod(error, language);
      });
  };

  const handleGenerateOtpCitizen = () => {
    if (watch("referenceMobileNo")) {
      setLoading(true);
      let _no = {
        amobileNo: watch("referenceMobileNo"),
      };
      console.log("_no", _no);
      axios
        // .get(
        //   `${
        //     urls.LMSURL
        //   }/trnApplyForNewMembership/generateOtpCheckReferenceMobileNumber?referenceMobileNo=${watch(
        //     "referenceMobileNo"
        //   )}`,
        .post(`${urls.LMSURL}/trnApplyForNewMembership/existsByMobileNo`, _no, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((r) => {
          setLoading(false);
          //   setLibraryKeys(
          //     r.data.libraryMasterList.map((row) => ({
          //       id: row.id,
          //       // zoneName: row.zoneName,
          //       // zoneNameMr: row.zoneNameMr,
          //       libraryName: row.libraryName,
          //       libraryType: row.libraryType
          //     })),
          //   )
          if (r?.data?.status === "Success") {
            sweetAlert({
              title: language === "en" ? "Successfully!" : "यशस्वीरित्या!",
              text:
                language === "en"
                  ? "OTP sent to Mobile/Email of Witness successfully !"
                  : "साक्षीदाराच्या मोबाईल/ईमेलवर ओटीपी यशस्वीरित्या पाठवला!",
              icon: "warning",
              button: language === "en" ? "Ok" : "ठीक आहे",
            });
            // setUsernameVerify(r.data?.aemail);
            setUsernameVerify(watch("referenceMobileNo"));
            setWitnessId(r?.data?.id);
            setGenerateOTP(true);
            console.log("generate", r);
          } else {
            sweetAlert({
              title: language === "en" ? "Not Exist !" : "अस्तित्वात नाही !",
              text:
                language === "en"
                  ? // ? "Mobile/Email of Witness does not exist !"
                    r?.data?.message
                  : "साक्षीदाराचा मोबाईल/ईमेल अस्तित्वात नाही!",
              icon: "warning",
              button: language === "en" ? "Ok" : "ठीक आहे",
            });
          }
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
        });
    } else {
      sweetAlert({
        title: language === "en" ? "Not Found !" : "आढळले नाही!",
        text:
          language === "en"
            ? "Please Enter Witness Mobile No. !!"
            : "कृपया साक्षीदार मोबाईल क्रमांक प्रविष्ट करा.!!",
        icon: "warning",
        button: language === "en" ? "Ok" : "ठीक आहे",
      });
      // setError("referenceMobileNo", {
      //   message: "Please Enter Witness Mobile No.",
      // });
    }
  };

  const handleVerifyOtpCitizen = () => {
    setLoading(true);
    const otpVer = {
      username: usernameVerify,
      otp: citizenOTP,
    };
    axios
      .post(`${urls.LMSURL}/trnApplyForNewMembership/verifyOtp`, otpVer, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setLoading(false);
        if (res.status == 200) {
          // swal("Verified!", "Mobile/Email verified successfully !", "success");
          sweetAlert({
            title: language === "en" ? "Verified !" : "सत्यापित!",
            text:
              language === "en"
                ? "Mobile/Email verified successfully !"
                : "मोबाइल/ईमेल यशस्वीरित्या सत्यापित झाले!",
            icon: "success",
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
          // router.push({
          //   pathname: `/dashboard`,
          // })
          setGenerateOTP(false);
          setOTPVerified(true);
        }
      })
      .catch((err) => {
        // swal("Incorrect!", "Incorrect OTP Mobile/Email not verified!", "error");
        sweetAlert({
          title: language === "en" ? "Incorrect !" : "चुकीचे!",
          text:
            language === "en"
              ? "Incorrect OTP Mobile/Email not verified! !"
              : "चुकीचे OTP मोबाइल/ईमेल सत्यापित नाही!",
          icon: "error",
          button: language === "en" ? "Ok" : "ठीक आहे",
        });
        setLoading(false);
      });
  };

  // for  print
  const handleGetName = (e) => {
    console.log("efdssssssssss", e);
    setEncryptedFileNameToSend(e);
  };

  useEffect(() => {
    if (router?.query?.formMode === "View") {
      setLastbtnMode(true);
    } else {
      setLastbtnMode(false);
    }
  }, [router?.query]);

  console.log(watch("aadharCardDoc1"), "pppppppppppppp");

  return (
    <>
      <ThemeProvider theme={theme}>
        <Paper className={styles.outerPaper}>
          {!props.onlyDoc && (
            <>
              {/* <div className={`${styles.details} ${styles.headingAlignModule}`}>
                <div className={styles.h1Tag}>
                  <span className={styles.headingStyle}>
                    {<FormattedLabel id="module" />}
                  </span>
                </div>
              </div> */}
              <Box>
                <BreadcrumbComponent />
              </Box>
              <LmsHeader labelName="module" showBackBtn={false} />
            </>
          )}
          {loading ? (
            <Loader />
          ) : (
            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  {/* <div className={styles.small}> */}
                  {!props.onlyDoc && (
                    <>
                      <Grid
                        container
                        spacing={2}
                        columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                        className={styles.gridContainer1}
                        columns={16}
                      >
                        <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                          <FormControl
                            variant="standard"
                            sx={{ marginTop: 2, width: "100%" }}
                            error={!!errors.zoneKey}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="zone" required />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: "100%" }}
                                  disabled={disable}
                                  value={field.value}
                                  onChange={(value) => {
                                    field.onChange(value);
                                    console.log(
                                      "Zone Key: ",
                                      value.target.value
                                    );
                                    // setTemp(value.target.value)
                                  }}
                                  label="Zone Name  "
                                >
                                  {zoneKeys &&
                                    zoneKeys.map((zoneKey, index) => (
                                      <MenuItem key={index} value={zoneKey.id}>
                                        {/*  {zoneKey.zoneKey} */}

                                        {language == "en"
                                          ? zoneKey?.zoneName
                                          : zoneKey?.zoneNameMr}
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
                        <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                          <FormControl
                            variant="standard"
                            sx={{ marginTop: 2, width: "100%" }}
                            error={!!errors.libraryType}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="libraryTypes" required />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: "100%" }}
                                  disabled={disable}
                                  value={field.value}
                                  onChange={(value) => {
                                    field.onChange(value);
                                    console.log(
                                      "Zone Key: ",
                                      value.target.value
                                    );
                                    // setTemp(value.target.value)
                                  }}
                                  label="Library Types"
                                >
                                  {libraryTypes &&
                                    libraryTypes?.map((lib, index) => (
                                      <MenuItem key={index} value={lib.value}>
                                        {/*  {zoneKey.zoneKey} */}

                                        {language == "en"
                                          ? lib?.libraryName
                                          : lib?.libraryNameMr}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="libraryType"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.libraryType
                                ? errors.libraryType.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                          <FormControl
                            variant="standard"
                            sx={{ marginTop: 2, width: "100%" }}
                            error={!!errors.libraryKey}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="libraryCSC" required />
                              {/* Library/Competitive Study Centre */}
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: "100%" }}
                                  disabled={disable}
                                  value={field.value}
                                  onChange={(value) => {
                                    field.onChange(value);
                                    console.log(
                                      "Zone Key: ",
                                      value.target.value
                                    );
                                    // setTemp(value.target.value)
                                  }}
                                  // label="Library/Competitive Study Centre "
                                  label={
                                    <FormattedLabel id="libraryCSC" required />
                                  }
                                >
                                  {libraryKeys &&
                                    libraryKeys.map((libraryKey, index) => (
                                      <MenuItem
                                        key={index}
                                        value={libraryKey.id}
                                      >
                                        {/*  {zoneKey.zoneKey} */}

                                        {language == "en"
                                          ? libraryKey?.libraryName
                                          : libraryKey?.libraryNameMr}
                                        {/* {libraryKey?.libraryName} */}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="libraryKey"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.libraryKey
                                ? errors.libraryKey.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>

                      <div className={styles.details}>
                        <div className={styles.h1Tag}>
                          <span className={styles.headingStyle1}>
                            {<FormattedLabel id="applicantName" />}
                            {/* Applicant Name */}
                          </span>
                        </div>
                      </div>
                      <Grid
                        container
                        spacing={2}
                        columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                        className={styles.gridContainer2}
                        columns={16}
                      >
                        <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                          <FormControl
                            variant="standard"
                            error={!!errors.atitle}
                            sx={{ marginTop: 2, width: "100%" }}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="titleEn" required />
                              {/* Title In English */}
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  // disabled
                                  sx={{ width: "100%" }}
                                  disabled={disable}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label={
                                    <FormattedLabel id="titleEn" required />
                                  }
                                  id="demo-simple-select-standard"
                                  labelId="id='demo-simple-select-standard-label'"
                                >
                                  {atitles &&
                                    atitles.map((atitle, index) => (
                                      <MenuItem key={index} value={atitle.id}>
                                        {atitle.atitle}
                                        {/* {language == 'en'
                                        ? atitle?.title
                                        : atitle?.titleMr} */}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="atitle"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.atitle ? errors.atitle.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>

                        <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                          {/* <TextField
                            disabled={disable}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 230 }}
                            id="standard-basic"
                            label={<FormattedLabel id="fnameEn" required />}
                            // label="First Name (In English)"
                            variant="standard"
                            {...register('afName')}
                            error={!!errors?.afName}
                            helperText={
                              errors?.afName ? errors?.afName?.message : null
                            }
                          /> */}
                          <Transliteration
                            _key={"afName"}
                            // labelName={"fnameEn"}
                            fieldName={"afName"}
                            updateFieldName={"afNameMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            disabled={disable}
                            label={<FormattedLabel id="fnameEn" required />}
                            error={!!errors.afName}
                            targetError={"afNameMr"}
                            textFieldMargin={1}
                            helperText={
                              errors?.afName ? errors.afName.message : null
                            }
                          />
                        </Grid>

                        <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                          {/* <TextField
                            //  disabled
                            disabled={disable}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 230 }}
                            id="standard-basic"
                            // label="Middle Name (In English)"
                            label={<FormattedLabel id="mnameEn" required />}
                            variant="standard"
                            {...register('amName')}
                            error={!!errors.amName}
                            helperText={
                              errors?.amName ? errors.amName.message : null
                            }
                          /> */}
                          <Transliteration
                            _key={"amName"}
                            // labelName={"fnameEn"}
                            fieldName={"amName"}
                            updateFieldName={"amNameMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            disabled={disable}
                            label={<FormattedLabel id="mnameEn" required />}
                            error={!!errors.amName}
                            targetError={"amNameMr"}
                            textFieldMargin={1}
                            helperText={
                              errors?.amName ? errors.amName.message : null
                            }
                          />
                        </Grid>
                        <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                          {/* <TextField
                            // disabled
                            disabled={disable}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 230 }}
                            id="standard-basic"
                            // label="Last Name (In English)"
                            label={<FormattedLabel id="lnameEn" required />}
                            variant="standard"
                            {...register('alName')}
                            error={!!errors.alName}
                            helperText={
                              errors?.alName ? errors.alName.message : null
                            }
                          /> */}
                          <Transliteration
                            _key={"alName"}
                            // labelName={"fnameEn"}
                            fieldName={"alName"}
                            updateFieldName={"alNameMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            disabled={disable}
                            label={<FormattedLabel id="lnameEn" required />}
                            error={!!errors.alName}
                            targetError={"alNameMr"}
                            textFieldMargin={1}
                            helperText={
                              errors?.alName ? errors.alName.message : null
                            }
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        spacing={2}
                        columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                        className={styles.gridContainer2}
                        columns={16}
                      >
                        <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                          <FormControl
                            variant="standard"
                            error={!!errors.atitlemr}
                            sx={{ marginTop: 2, width: "100%" }}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="titleMr" required />
                              {/* Title in Marathi */}
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  // disabled
                                  sx={{ width: "100%" }}
                                  disabled={disable}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label={
                                    <FormattedLabel id="titleMr" required />
                                  }
                                  id="demo-simple-select-standard"
                                  labelId="id='demo-simple-select-standard-label'"
                                >
                                  {TitleMrs &&
                                    TitleMrs.map((atitlemr, index) => (
                                      <MenuItem key={index} value={atitlemr.id}>
                                        {atitlemr.atitlemr}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="atitlemr"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.atitlemr
                                ? errors.atitlemr.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>

                        <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                          {/* <TextField
                            //  disabled
                            disabled={disable}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 230 }}
                            id="standard-basic"
                            // label="First Name (In Marathi)"
                            label={<FormattedLabel id="fnameMr" required />}
                            // label=" Hello"
                            variant="standard"
                            {...register('afNameMr')}
                            error={!!errors.afNameMr}
                            helperText={
                              errors?.afNameMr ? errors.afNameMr.message : null
                            }
                          /> */}
                          <Transliteration
                            _key={"afNameMr"}
                            labelName={"firstNamemr"}
                            fieldName={"afNameMr"}
                            updateFieldName={"afName"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            disabled={disable}
                            label={<FormattedLabel id="fnameMr" required />}
                            error={!!errors.afNameMr}
                            targetError={"afName"}
                            textFieldMargin={1}
                            helperText={
                              errors?.afNameMr ? errors.afNameMr.message : null
                            }
                          />
                        </Grid>

                        <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                          {/* <TextField
                            //  disabled
                            disabled={disable}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 230 }}
                            id="standard-basic"
                            // label="Middle Name (In Marathi)"
                            label={
                              <FormattedLabel id="mnameMr" required />
                            }
                            // label="मधले नावं *"
                            variant="standard"
                            {...register('amNameMr')}
                            error={!!errors.amNameMr}
                            helperText={
                              errors?.amNameMr ? errors.amNameMr.message : null
                            }
                          /> */}
                          <Transliteration
                            _key={"amNameMr"}
                            // labelName={"firstNamemr"}
                            fieldName={"amNameMr"}
                            updateFieldName={"amName"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            disabled={disable}
                            label={<FormattedLabel id="mnameMr" required />}
                            error={!!errors.amNameMr}
                            targetError={"amName"}
                            textFieldMargin={1}
                            helperText={
                              errors?.amNameMr ? errors.amNameMr.message : null
                            }
                          />
                        </Grid>
                        <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                          {/* <TextField
                            // disabled
                            disabled={disable}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 230 }}
                            id="standard-basic"
                            // label="Last Name (In Marathi) "
                            label={<FormattedLabel id="lnameMr" required />}
                            // label="आडनाव *"
                            variant="standard"
                            {...register('alNameMr')}
                            error={!!errors.alNameMr}
                            helperText={
                              errors?.alNameMr ? errors.alNameMr.message : null
                            }
                          /> */}
                          <Transliteration
                            _key={"alNameMr"}
                            // labelName={"firstNamemr"}
                            fieldName={"alNameMr"}
                            updateFieldName={"alName"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            disabled={disable}
                            label={<FormattedLabel id="lnameMr" required />}
                            error={!!errors.alNameMr}
                            targetError={"alName"}
                            textFieldMargin={1}
                            helperText={
                              errors?.alNameMr ? errors.alNameMr.message : null
                            }
                          />
                        </Grid>
                      </Grid>

                      <div className={styles.details}>
                        <div className={styles.h1Tag}>
                          <span className={styles.headingStyle1}>
                            {<FormattedLabel id="ApplicatDetails" />}
                            {/* Applicant Details */}
                          </span>
                        </div>
                      </div>

                      <Grid
                        container
                        spacing={2}
                        columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                        className={styles.gridContainer2}
                        columns={16}
                      >
                        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                          {/* <TextField
                            //  disabled
                            disabled={disable}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={
                              <FormattedLabel id="flatBuildingNo" required />
                            }
                            // label="Flat/Building No (In English) "
                            variant="standard"
                            {...register('aflatBuildingNo')}
                            error={!!errors.aflatBuildingNo}
                            helperText={
                              errors?.aflatBuildingNo
                                ? errors.aflatBuildingNo.message
                                : null
                            }
                          /> */}
                          <Transliteration
                            _key={"aflatBuildingNo"}
                            // labelName={"aflatBuildingNo"}
                            fieldName={"aflatBuildingNo"}
                            updateFieldName={"aflatBuildingNoMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            disabled={disable}
                            label={
                              <FormattedLabel id="flatBuildingNo" required />
                            }
                            error={!!errors.aflatBuildingNo}
                            targetError={"aflatBuildingNoMr"}
                            textFieldMargin={1}
                            helperText={
                              errors?.aflatBuildingNo
                                ? errors.aflatBuildingNo.message
                                : null
                            }
                          />
                        </Grid>

                        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                          {/* <TextField
                            //  disabled
                            disabled={disable}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={
                              <FormattedLabel id="buildingName" required />
                            }
                            // label="Apartment Name (In English)"
                            variant="standard"
                            {...register('abuildingName')}
                            error={!!errors.abuildingName}
                            helperText={
                              errors?.abuildingName
                                ? errors.abuildingName.message
                                : null
                            }
                          /> */}
                          <Transliteration
                            _key={"abuildingName"}
                            // labelName={"abuildingName"}
                            fieldName={"abuildingName"}
                            updateFieldName={"abuildingNameMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            disabled={disable}
                            label={
                              <FormattedLabel id="buildingName" required />
                            }
                            error={!!errors.abuildingName}
                            targetError={"abuildingNameMr"}
                            textFieldMargin={1}
                            helperText={
                              errors?.abuildingName
                                ? errors?.abuildingName.message
                                : null
                            }
                          />
                        </Grid>

                        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                          {/* <TextField
                            //  disabled
                            disabled={disable}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="roadNameEn" required />}
                            // label="Road Name (In English)"
                            variant="standard"
                            {...register('aroadName')}
                            error={!!errors.aroadName}
                            helperText={
                              errors?.aroadName
                                ? errors.aroadName.message
                                : null
                            }
                          /> */}
                          <Transliteration
                            _key={"aroadName"}
                            // labelName={"aroadName"}
                            fieldName={"aroadName"}
                            updateFieldName={"aroadNameMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            disabled={disable}
                            label={<FormattedLabel id="roadNameEn" required />}
                            error={!!errors.aroadName}
                            targetError={"aroadNameMr"}
                            textFieldMargin={1}
                            helperText={
                              errors?.aroadName
                                ? errors?.aroadName.message
                                : null
                            }
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        spacing={2}
                        columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                        className={styles.gridContainer2}
                        columns={16}
                      >
                        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                          {/* <TextField
                            //  disabled
                            disabled={disable}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="landmarkEn" required />}
                            // label="Landmark (In English)"
                            variant="standard"
                            {...register('alandmark')}
                            error={!!errors.alandmark}
                            helperText={
                              errors?.alandmark
                                ? errors.alandmark.message
                                : null
                            }
                          /> */}
                          <Transliteration
                            _key={"alandmark"}
                            // labelName={"alandmark"}
                            fieldName={"alandmark"}
                            updateFieldName={"alandmarkMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            disabled={disable}
                            label={<FormattedLabel id="landmarkEn" required />}
                            error={!!errors.alandmark}
                            targetError={"alandmarkMr"}
                            textFieldMargin={1}
                            helperText={
                              errors?.alandmark
                                ? errors?.alandmark.message
                                : null
                            }
                          />
                        </Grid>

                        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                          {/* <TextField
                            //  disabled
                            disabled={disable}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="cityOrVillageEn" required />}
                            // label="City Name / Village Name (In English)"
                            variant="standard"
                            {...register('acityName')}
                            error={!!errors.acityName}
                            helperText={
                              errors?.acityName
                                ? errors.acityName.message
                                : null
                            }
                          /> */}
                          <Transliteration
                            _key={"acityName"}
                            // labelName={"acityName"}
                            fieldName={"acityName"}
                            updateFieldName={"acityNameMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            disabled={disable}
                            label={
                              <FormattedLabel id="cityOrVillageEn" required />
                            }
                            error={!!errors.acityName}
                            targetError={"acityNameMr"}
                            textFieldMargin={1}
                            helperText={
                              errors?.acityName
                                ? errors?.acityName.message
                                : null
                            }
                          />
                        </Grid>

                        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                          {/* <TextField
                            defaultValue="Maharashtra"
                            //  disabled
                            disabled={disable}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="state" required />}
                            // label="State (In English)"
                            variant="standard"
                            {...register('astate')}
                            error={!!errors.astate}
                            helperText={
                              errors?.astate ? errors.astate.message : null
                            }
                          /> */}
                          <Transliteration
                            _key={"astate"}
                            // labelName={"astate"}
                            fieldName={"astate"}
                            updateFieldName={"astateMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            disabled={disable}
                            label={<FormattedLabel id="state" required />}
                            error={!!errors.astate}
                            targetError={"astateMr"}
                            textFieldMargin={1}
                            helperText={
                              errors?.astate ? errors?.astate.message : null
                            }
                          />
                        </Grid>
                      </Grid>

                      {/* marathi Adress */}

                      <Grid
                        container
                        spacing={2}
                        columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                        className={styles.gridContainer2}
                        columns={16}
                      >
                        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                          {/* <TextField
                            disabled={disable}
                            sx={{ width: 250 }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            id="standard-basic"
                            label={
                              <FormattedLabel id="flatBuildingNoMr" required />
                            }
                            // label="Flat/Building No (In Marathi)"
                            variant="standard"
                            //  value={`${this.state.pflatBuildingNo},${this.state.cflatBuildingNo}`}
                            //  value={pflatBuildingNo}
                            // onChange={(e) => setValue(e.target.pflatBuildingNo)}
                            {...register('aflatBuildingNoMr')}
                            error={!!errors.aflatBuildingNoMr}
                            helperText={
                              errors?.aflatBuildingNoMr
                                ? errors.aflatBuildingNoMr.message
                                : null
                            }
                          /> */}

                          <Transliteration
                            _key={"aflatBuildingNoMr"}
                            // labelName={"firstNamemr"}
                            fieldName={"aflatBuildingNoMr"}
                            updateFieldName={"aflatBuildingNo"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            disabled={disable}
                            label={
                              <FormattedLabel id="flatBuildingNoMr" required />
                            }
                            error={!!errors.aflatBuildingNoMr}
                            targetError={"aflatBuildingNo"}
                            textFieldMargin={1}
                            helperText={
                              errors?.aflatBuildingNoMr
                                ? errors.aflatBuildingNoMr.message
                                : null
                            }
                          />
                        </Grid>

                        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                          {/* <TextField
                            //  disabled
                            disabled={disable}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={
                              <FormattedLabel id="buildingNameMr" required />
                            }
                            // label="Apartment Name (In Marathi)"
                            variant="standard"
                            {...register('abuildingNameMr')}
                            error={!!errors.abuildingNameMr}
                            helperText={
                              errors?.abuildingNameMr
                                ? errors.abuildingNameMr.message
                                : null
                            }
                          /> */}
                          <Transliteration
                            _key={"abuildingNameMr"}
                            // labelName={"abuildingNameMr"}
                            fieldName={"abuildingNameMr"}
                            updateFieldName={"abuildingName"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            disabled={disable}
                            label={
                              <FormattedLabel id="buildingNameMr" required />
                            }
                            error={!!errors.abuildingNameMr}
                            targetError={"abuildingName"}
                            textFieldMargin={1}
                            helperText={
                              errors?.abuildingNameMr
                                ? errors.abuildingNameMr.message
                                : null
                            }
                          />
                        </Grid>

                        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                          {/* <TextField
                            //  disabled
                            disabled={disable}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            // label="Road Name (In Marathi)"
                            label={<FormattedLabel id="roadNameMr" required />}
                            // label="गल्लीचे नाव"
                            variant="standard"
                            {...register('aroadNameMr')}
                            error={!!errors.aroadNameMr}
                            helperText={
                              errors?.aroadNameMr
                                ? errors.aroadNameMr.message
                                : null
                            }
                          /> */}
                          <Transliteration
                            _key={"aroadNameMr"}
                            // labelName={"aroadNameMr"}
                            fieldName={"aroadNameMr"}
                            updateFieldName={"aroadName"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            disabled={disable}
                            label={<FormattedLabel id="roadNameMr" required />}
                            error={!!errors.aroadNameMr}
                            targetError={"aroadName"}
                            textFieldMargin={1}
                            helperText={
                              errors?.aroadNameMr
                                ? errors.aroadNameMr.message
                                : null
                            }
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        spacing={2}
                        columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                        className={styles.gridContainer2}
                        columns={16}
                      >
                        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                          {/* <TextField
                            //  disabled
                            disabled={disable}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            // label="Landmark (In Marathi)"
                            label={<FormattedLabel id="landmarkMr" required />}
                            // label="जमीन चिन्ह"
                            variant="standard"
                            {...register('alandmarkMr')}
                            error={!!errors.alandmarkMr}
                            helperText={
                              errors?.alandmarkMr
                                ? errors.alandmarkMr.message
                                : null
                            }
                          /> */}
                          <Transliteration
                            _key={"alandmarkMr"}
                            // labelName={"alandmarkMr"}
                            fieldName={"alandmarkMr"}
                            updateFieldName={"alandmark"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            disabled={disable}
                            label={<FormattedLabel id="landmarkMr" required />}
                            error={!!errors.alandmarkMr}
                            targetError={"alandmark"}
                            textFieldMargin={1}
                            helperText={
                              errors?.alandmarkMr
                                ? errors.alandmarkMr.message
                                : null
                            }
                          />
                        </Grid>

                        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                          {/* <TextField
                            //  disabled
                            disabled={disable}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            // label="City Name / Village Name (In Marathi)"
                            label={<FormattedLabel id="cityOrVillageMr" required />}
                            // label="शहराचे नाव"
                            variant="standard"
                            {...register('acityNameMr')}
                            error={!!errors.acityNameMr}
                            helperText={
                              errors?.acityNameMr
                                ? errors.acityNameMr.message
                                : null
                            }
                          /> */}
                          <Transliteration
                            _key={"acityNameMr"}
                            // labelName={"acityNameMr"}
                            fieldName={"acityNameMr"}
                            updateFieldName={"acityName"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            disabled={disable}
                            label={
                              <FormattedLabel id="cityOrVillageMr" required />
                            }
                            error={!!errors.acityNameMr}
                            targetError={"acityName"}
                            textFieldMargin={1}
                            helperText={
                              errors?.acityNameMr
                                ? errors.acityNameMr.message
                                : null
                            }
                          />
                        </Grid>

                        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                          {/* <TextField
                            defaultValue="महाराष्ट्र"
                            disabled={disable}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 230 }}
                            id="standard-basic"
                            label={<FormattedLabel id="stateMr" required />}
                            // label="State (In Marathi)"
                            variant="standard"
                            {...register('astateMr')}
                            error={!!errors.astateMr}
                            helperText={
                              errors?.astateMr ? errors.astateMr.message : null
                            }
                          /> */}

                          <Transliteration
                            _key={"astateMr"}
                            // labelName={"astateMr"}
                            fieldName={"astateMr"}
                            updateFieldName={"astate"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            disabled={disable}
                            label={<FormattedLabel id="stateMr" required />}
                            error={!!errors.astateMr}
                            targetError={"astate"}
                            textFieldMargin={1}
                            helperText={
                              errors?.astateMr ? errors.astateMr.message : null
                            }
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        spacing={2}
                        columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                        className={styles.gridContainer2}
                        columns={16}
                      >
                        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                          <TextField
                            //  disabled
                            disabled={disable}
                            InputLabelProps={{
                              shrink: watch("apincode") ? true : false,
                            }}
                            sx={{ width: "100%" }}
                            id="standard-basic"
                            inputProps={{
                              maxLength: 6,
                            }}
                            label={<FormattedLabel id="pincode" required />}
                            variant="standard"
                            {...register("apincode")}
                            error={!!errors.apincode}
                            helperText={
                              errors?.apincode ? errors.apincode.message : null
                            }
                          />
                        </Grid>
                        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                          <TextField
                            disabled={disable}
                            InputLabelProps={{
                              shrink: watch("amobileNo") ? true : false,
                            }}
                            sx={{ width: "100%" }}
                            id="standard-basic"
                            label={<FormattedLabel id="mobile" required />}
                            // label="Mobile No"
                            variant="standard"
                            // value={pageType ? router.query.mobile : ''}
                            // disabled={router.query.pageMode === 'View'}
                            {...register("amobileNo")}
                            inputProps={{ maxLength: 10 }}
                            error={!!errors.amobileNo}
                            helperText={
                              errors?.amobileNo
                                ? errors.amobileNo.message
                                : null
                            }
                          />
                        </Grid>

                        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                          <TextField
                            disabled={disable}
                            InputLabelProps={{
                              shrink: watch("aemail") ? true : false,
                            }}
                            sx={{ width: "100%" }}
                            id="standard-basic"
                            label={<FormattedLabel id="email" required />}
                            variant="standard"
                            //  value={pageType ? router.query.emailAddress : ''}
                            // disabled={router.query.pageMode === 'View'}
                            {...register("aemail")}
                            error={!!errors.aemail}
                            helperText={
                              errors?.aemail ? errors.aemail.message : null
                            }
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        spacing={2}
                        columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                        className={styles.gridContainer2}
                        columns={16}
                      >
                        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                          <TextField
                            InputLabelProps={{
                              shrink:
                                (watch("aadharNo") ? true : false) ||
                                (router.query.aadharNo ? true : false),
                            }}
                            sx={{ width: "100%" }}
                            id="standard-basic"
                            inputProps={{ maxLength: 12 }}
                            label={<FormattedLabel id="aadharNo" required />}
                            // label="Aadhar No"
                            variant="standard"
                            disabled={disable}
                            {...register("aadharNo")}
                            error={!!errors.aadharNo}
                            helperText={
                              errors?.aadharNo
                                ? errors?.aadharNo?.message
                                : null
                            }
                          />
                        </Grid>

                        {isCompi ? (
                          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                            <TextField
                              InputLabelProps={{
                                shrink:
                                  (watch("education") ? true : false) ||
                                  (router.query.education ? true : false),
                              }}
                              id="standard-basic"
                              label={<FormattedLabel id="education" required />}
                              // label="Aadhar No"
                              variant="standard"
                              sx={{ width: "100%" }}
                              disabled={disable}
                              {...register("education")}
                              error={!!errors.education}
                              helperText={
                                errors?.education
                                  ? errors.education.message
                                  : null
                              }
                            />
                          </Grid>
                        ) : (
                          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                            <FormControl
                              variant="standard"
                              sx={{ marginTop: 2, width: "100%" }}
                              error={!!errors.libraryType}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                <FormattedLabel id="educationD" required />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    sx={{ width: "100%" }}
                                    disabled={disable}
                                    value={field.value}
                                    onChange={(value) => {
                                      field.onChange(value);
                                      console.log(
                                        "education",
                                        value.target.value
                                      );
                                    }}
                                    label="Education"
                                  >
                                    {educationList &&
                                      educationList?.map((lib, index) => (
                                        <MenuItem
                                          key={index}
                                          value={lib.nameEn}
                                        >
                                          {language == "en"
                                            ? lib?.nameEn
                                            : lib?.nameEn}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                name="education"
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText>
                                {errors?.education
                                  ? errors.education.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                        )}
                      </Grid>

                      <div className={styles.details}>
                        <div className={styles.h1Tag}>
                          <span className={styles.headingStyle1}>
                            {<FormattedLabel id="witnessDetails" />}
                          </span>
                        </div>
                      </div>
                      <Grid
                        container
                        spacing={2}
                        columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                        className={styles.gridContainer2}
                        columns={16}
                      >
                        {language == "en" ? (
                          <Typography className={styles.redText}>
                            {/* <FormattedLabel id="attachmentSchema" /> */}
                            *Note:- Witness Should be a library Member
                          </Typography>
                        ) : (
                          <Typography className={styles.redText}>
                            {/* <FormattedLabel id="attachmentSchema" /> */}
                            *नोंद:- साक्षीदार हा ग्रंथालय सदस्य असावा
                          </Typography>
                        )}
                      </Grid>
                      <Grid
                        container
                        spacing={2}
                        columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                        className={styles.gridContainer2}
                        columns={16}
                      >
                        <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                          <TextField
                            // disabled={disable}
                            InputLabelProps={{
                              shrink: watch("referenceMobileNo") ? true : false,
                            }}
                            sx={{ width: "100%" }}
                            id="standard-basic"
                            label={
                              <FormattedLabel
                                id="referenceMobileNo"
                                required={
                                  watch("libraryType") === "L" ? true : false
                                }
                              />
                            }
                            // label="Mobile No"
                            disabled={disable || verifyOTP}
                            inputProps={{ maxLength: 10 }}
                            variant="standard"
                            {...register("referenceMobileNo")}
                            // onChange={(txt) => {
                            //   setReferenceMobileNo(txt.target.value);
                            // }}
                            error={!!errors.referenceMobileNo}
                            helperText={
                              errors?.referenceMobileNo
                                ? errors.referenceMobileNo.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                          <Button
                            fullWidth
                            size="small"
                            variant="contained"
                            type="button"
                            // disabled={isOtpVerifiedCitizen}
                            onClick={() => {
                              handleGenerateOtpCitizen();
                            }}
                            className={styles.button}
                            sx={{ width: "80%", marginTop: "5vh" }}
                            // disabled={verifyOTP}
                            disabled={router?.query?.id || verifyOTP}
                          >
                            {/* {isOtpVerifiedCitizen ? "Verified" : "Verify OTP"} */}
                            <span className={styles.buttonText1}>
                              {/* {!verifyOTP ? "Generate OTP" : "OTP Verified"} */}
                              {!verifyOTP && !router?.query?.id ? (
                                <FormattedLabel id="generateOtp" />
                              ) : (
                                <FormattedLabel id="verifiedOtp" />
                              )}
                            </span>
                          </Button>
                        </Grid>
                        {generateOTP ? (
                          <>
                            <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                              <TextField
                                sx={{
                                  letterSpacing: "15px",
                                  backgroundColor: "#FFFFFF",
                                  borderRadius: "5px",
                                  marginTop: "5vh",
                                }}
                                InputLabelProps={{
                                  style: {
                                    color: "#000000",
                                    fontSize: "15px",
                                    letterSpacing: "12px",
                                  },
                                }}
                                InputProps={{
                                  style: {
                                    fontSize: "15px",
                                    letterSpacing: "15px",
                                  },
                                }}
                                inputProps={{
                                  style: { fontSize: "15px" },
                                  maxLength: 6,
                                }}
                                variant="outlined"
                                fullWidth
                                size="small"
                                placeholder="- - - - - -"
                                // value={otp}
                                onChange={(txt) => {
                                  // setOtpCitizen(txt.target.value);
                                  setCitizenOTP(txt.target.value);
                                  console.log(
                                    "otpInput",
                                    txt.target.value?.split("")
                                  );
                                }}
                              />
                            </Grid>
                            <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                              <Button
                                fullWidth
                                size="small"
                                variant="contained"
                                type="button"
                                // disabled={isOtpVerifiedCitizen}
                                disabled={
                                  citizenOTP?.split("")?.length === 6
                                    ? false
                                    : true
                                }
                                onClick={handleVerifyOtpCitizen}
                                className={styles.button}
                                sx={{ width: "80%", marginTop: "5vh" }}
                              >
                                {/* {isOtpVerifiedCitizen ? "Verified" : "Verify OTP"} */}
                                <span className={styles.buttonText1}>
                                  {" "}
                                  Verify
                                </span>
                              </Button>
                            </Grid>
                          </>
                        ) : (
                          ""
                        )}
                      </Grid>
                      {/* owner details */}

                      <div className={styles.details}>
                        <div className={styles.h1Tag}>
                          <span className={styles.headingStyle1}>
                            {<FormattedLabel id="membershipDetails" />}
                            {/* Membership Details */}
                            {/* Owner Details : */}
                          </span>
                        </div>
                      </div>

                      <Grid
                        container
                        spacing={2}
                        columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                        className={styles.gridContainer2}
                        columns={16}
                      >
                        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                          <FormControl
                            sx={{ marginTop: 0 }}
                            error={!!errors.applicationDate}
                          >
                            <Controller
                              control={control}
                              name="applicationDate"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    // maxDate={new Date()}
                                    // disabled={disable}
                                    disabled
                                    inputFormat="DD/MM/YYYY"
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        {" "}
                                        {/* Membership Start Date */}
                                        {
                                          <FormattedLabel
                                            id="applicationDate"
                                            required
                                          />
                                        }
                                      </span>
                                    }
                                    value={field.value}
                                    onChange={(date) =>
                                      field.onChange(
                                        moment(date).format("YYYY-MM-DD")
                                      )
                                    }
                                    selected={field.value}
                                    center
                                    renderInput={(params) => (
                                      <TextField
                                        // disabled={disabled}
                                        {...params}
                                        size="small"
                                        variant="standard"
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
                            />
                            <FormHelperText>
                              {errors?.applicationDate
                                ? errors.applicationDate.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                          {watch("libraryType") === "C" && (
                            <FormControl
                              variant="standard"
                              error={!!errors.membershipMonths}
                              sx={{ marginTop: 2 }}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                <FormattedLabel
                                  id="membershipMonths"
                                  required
                                />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    // disabled
                                    disabled={disable}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    label={
                                      <FormattedLabel
                                        id="membershipMonths"
                                        required
                                      />
                                    }
                                    // label="Membership for Months"
                                    id="demo-simple-select-standard"
                                    labelId="id='demo-simple-select-standard-label'"
                                  >
                                    {membershipMonthsKeys &&
                                      membershipMonthsKeys.map(
                                        (membershipMonths, index) => (
                                          <MenuItem
                                            key={index}
                                            value={membershipMonths.months}
                                          >
                                            {membershipMonths.label}
                                          </MenuItem>
                                        )
                                      )}
                                  </Select>
                                )}
                                name="membershipMonths"
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText>
                                {errors?.membershipMonths
                                  ? errors.membershipMonths.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          )}
                        </Grid>
                      </Grid>
                    </>
                  )}
                  {!props.preview && (
                    <>
                      <div className={styles.details}>
                        <div className={styles.h1Tag}>
                          <span className={styles.headingStyle1}>
                            {/* Documents Upload */}
                            {<FormattedLabel id="documentUpload" />}
                          </span>
                        </div>
                      </div>
                      {!props.onlyDoc ? (
                        <Grid
                          container
                          spacing={2}
                          columnSpacing={{
                            xs: 1,
                            sm: 2,
                            md: 3,
                            lg: 12,
                            xl: 12,
                          }}
                          className={styles.gridContainer2}
                          columns={16}
                        >
                          <span>
                            {language == "en" ? (
                              <Typography className={styles.redText}>
                                {/* <FormattedLabel id="attachmentSchema" /> */}
                                *Maximum upload file size should be 10 MB and
                                File should be in Image or PDF Format
                              </Typography>
                            ) : (
                              <Typography className={styles.redText}>
                                {/* <FormattedLabel id="attachmentSchema" /> */}
                                *कमाल अपलोड फाइल आकार १० एमबी असावा आणि फाइल
                                प्रतिमा किंवा पीडीएफ स्वरूपात असावी
                              </Typography>
                            )}
                          </span>
                        </Grid>
                      ) : (
                        ""
                      )}
                      <Grid
                        container
                        spacing={2}
                        paddingLeft={5}
                        columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                        className={styles.gridContainer2}
                        columns={16}
                      >
                        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                          <Typography>
                            {" "}
                            {/* Identity Proof */}
                            {<FormattedLabel id="identityProof" required />}
                          </Typography>

                          <UploadButton
                            error={!!errors?.aadharCardDoc}
                            appName={appName}
                            serviceName={serviceName}
                            fileDtl={watch("aadharCardDoc")}
                            fileKey={"aadharCardDoc"}
                            fileNameEncrypted={(path) => {
                              handleGetName(path);
                              setEncryptedAadharCardDoc(path);
                            }}
                            // showDel={pageMode ? false : true}
                            // showDel={!props.onlyDoc ? true : false}
                            // showDel={
                            //   router.query?.applicationStatus == "I_CARD_ISSUE"
                            //     ? false
                            //     : true
                            // }
                            // showDel={true}
                            showDel={
                              router.query?.disabled == "true" ? false : true
                            }
                          />
                          <FormHelperText error={!!errors?.aadharCardDoc}>
                            {errors?.aadharCardDoc
                              ? errors?.aadharCardDoc?.message
                              : null}
                          </FormHelperText>
                        </Grid>
                        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                          <Typography>
                            {" "}
                            {/* Address Proof */}
                            {<FormattedLabel id="addressProof" required />}
                          </Typography>

                          <UploadButton
                            error={!!errors?.aadharCardDoc1}
                            appName={appName}
                            serviceName={serviceName}
                            fileDtl={watch("aadharCardDoc1")}
                            fileKey={"aadharCardDoc1"}
                            fileNameEncrypted={(path) => {
                              handleGetName(path);
                              setEncryptedAadharCardDoc1(path);
                            }}
                            // showDel={pageMode ? false : true}
                            // showDel={
                            //   router.query?.applicationStatus == "I_CARD_ISSUE"
                            //     ? false
                            //     : true
                            // }
                            // showDel={true}
                            showDel={
                              router.query?.disabled == "true" ? false : true
                            }
                          />
                          <FormHelperText error={!!errors?.aadharCardDoc1}>
                            {errors?.aadharCardDoc1
                              ? errors?.aadharCardDoc1?.message
                              : null}
                          </FormHelperText>
                        </Grid>
                        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                          <Typography>
                            {" "}
                            {/* Address Proof */}
                            {<FormattedLabel id="photoAttachment" required />}
                          </Typography>

                          <UploadButton
                            error={!!errors?.photoAttachment}
                            appName={appName}
                            serviceName={serviceName}
                            fileDtl={getValues("photoAttachment")}
                            fileKey={"photoAttachment"}
                            fileNameEncrypted={(path) => {
                              handleGetName(path);
                              setEncryptedPhotoAttachment(path);
                            }}
                            // showDel={pageMode ? false : true}
                            // showDel={
                            //   router.query?.applicationStatus == "I_CARD_ISSUE"
                            //     ? false
                            //     : true
                            // }
                            showDel={
                              router.query?.disabled == "true" ? false : true
                            }

                            // showDel={true}
                          />
                          <FormHelperText error={!!errors?.photoAttachment}>
                            {errors?.photoAttachment
                              ? errors?.photoAttachment?.message
                              : null}
                          </FormHelperText>
                        </Grid>
                        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                          <Typography>
                            {" "}
                            {/* Tax Receipt*/}
                            {
                              <FormattedLabel
                                id="taxReceipt"
                                required={
                                  watch("libraryType") === "L" ? true : false
                                }
                              />
                            }
                          </Typography>

                          <UploadButton
                            error={!!errors?.taxReceipt}
                            appName={appName}
                            serviceName={serviceName}
                            fileDtl={getValues("taxReceipt")}
                            fileKey={"taxReceipt"}
                            fileNameEncrypted={(path) => {
                              handleGetName(path);
                              setEncryptedTaxReceipt(path);
                            }}
                            // showDel={pageMode ? false : true}
                            // showDel={
                            //   router.query?.applicationStatus == "I_CARD_ISSUE"
                            //     ? false
                            //     : true
                            // }
                            showDel={
                              router.query?.disabled == "true" ? false : true
                            }

                            // showDel={true}
                          />
                          <FormHelperText error={!!errors?.taxReceipt}>
                            {errors?.taxReceipt
                              ? errors?.taxReceipt?.message
                              : null}
                          </FormHelperText>
                        </Grid>
                        {isCompi ? (
                          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                            <Typography>
                              {" "}
                              {/* Address Proof */}
                              {<FormattedLabel id="educationDoc" />}
                            </Typography>

                            <UploadButton
                              appName={appName}
                              serviceName={serviceName}
                              fileDtl={getValues("educationDoc")}
                              fileKey={"educationDoc"}
                              // showDel={pageMode ? false : true}
                              // showDel={!props.onlyDoc ? true : false}
                              showDel={
                                router.query?.disabled == "true" ? false : true
                              }
                              fileNameEncrypted={(path) => {
                                handleGetName(path);
                                setEncryptedEducationDoc(path);
                              }}
                              // showDel={true}
                            />
                          </Grid>
                        ) : (
                          ""
                        )}
                      </Grid>
                    </>
                  )}

                  {!props.preview && !props.onlyDoc && (
                    <>
                      <div className={styles.btn}>
                        <div className={styles.btn1}>
                          <Button
                            size="small"
                            type="button"
                            variant="contained"
                            color="primary"
                            endIcon={<SaveIcon />}
                            onClick={formPreviewDailogOpen}
                          >
                            {/* preview */}
                            {<FormattedLabel id="preview" />}
                          </Button>{" "}
                        </div>

                        <div className={styles.btn1}>
                          <Button
                            size="small"
                            type="submit"
                            variant="contained"
                            // disabled={!verifyOTP}
                            disabled={lastbtnMode}
                            color="success"
                            endIcon={<SaveIcon />}
                          >
                            {<FormattedLabel id={btnSaveText} />}
                          </Button>{" "}
                        </div>
                        <div className={styles.btn1}>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            endIcon={<ClearIcon />}
                            disabled={lastbtnMode}
                            onClick={() => cancellButton()}
                          >
                            {<FormattedLabel id="clear" />}
                          </Button>
                        </div>
                        <div className={styles.btn1}>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            endIcon={<ExitToAppIcon />}
                            // onClick={() => exitButton()}
                            onClick={() => {
                              sweetAlert({
                                title:
                                  language === "en"
                                    ? "Exit ? "
                                    : "बाहेर पडायचे ?",
                                text:
                                  language === "en"
                                    ? "Are you sure you want to exit this Record ? "
                                    : "तुम्हाला खात्री आहे की तुम्ही या रेकॉर्डमधून बाहेर पडू इच्छिता ?",
                                icon: "warning",
                                buttons: {
                                  ok: language === "en" ? "Ok" : "ठीक आहे",
                                  cancel:
                                    language === "en" ? "Cancel" : "रद्द करा",
                                },
                                dangerMode: false,
                                closeOnClickOutside: false,
                              }).then((will) => {
                                if (will) {
                                  swal({
                                    text:
                                      language === "en"
                                        ? "Successfully Exited !"
                                        : "यशस्वीरित्या बाहेर पडलो !",
                                    icon: "success",
                                    button:
                                      language === "en" ? "Ok" : "ठीक आहे",
                                  });
                                  // router.push(`/dashboard`);
                                  if (
                                    localStorage.getItem("loggedInUser") ==
                                    "citizenUser"
                                  ) {
                                    router.push(`/dashboard`);
                                  } else if (
                                    localStorage.getItem("loggedInUser") ==
                                    "cfcUser"
                                  ) {
                                    router.push(`/CFC_Dashboard`);
                                  } else {
                                    router.push(
                                      `/lms/transactions/newMembershipRegistration/scrutiny`
                                    );
                                  }
                                } else {
                                  swal({
                                    text:
                                      language === "en"
                                        ? "Record is Safe "
                                        : "रेकॉर्ड सुरक्षित आहे",
                                    icon: "success",
                                    button:
                                      language === "en" ? "Ok" : "ठीक आहे",
                                  });
                                }
                              });
                            }}
                          >
                            {<FormattedLabel id="exit" />}
                          </Button>
                        </div>
                      </div>
                    </>
                  )}

                  <>
                    {/** Dailog */}
                    <Dialog
                      fullWidth
                      maxWidth={"lg"}
                      open={formPreviewDailog}
                      onClose={() => formPreviewDailogClose()}
                    >
                      <CssBaseline />
                      <DialogTitle>
                        <Grid container>
                          <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                            {/* Preview */}
                            {<FormattedLabel id="preview" />}
                          </Grid>
                          <Grid
                            item
                            xs={1}
                            sm={2}
                            md={4}
                            lg={6}
                            xl={6}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <IconButton
                              aria-label="delete"
                              sx={{
                                marginLeft: "530px",
                                backgroundColor: "primary",
                                ":hover": {
                                  bgcolor: "red", // theme.palette.primary.main
                                  color: "white",
                                },
                              }}
                            >
                              <CloseIcon
                                sx={{
                                  color: "black",
                                }}
                                onClick={() => {
                                  formPreviewDailogClose();
                                }}
                              />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </DialogTitle>
                      <DialogContent>
                        <>
                          <ThemeProvider theme={theme}>
                            <Preview preview={true} />
                          </ThemeProvider>
                        </>
                      </DialogContent>

                      <DialogTitle>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={12}
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                              sweetAlert({
                                title:
                                  language === "en"
                                    ? "Exit ? "
                                    : "बाहेर पडायचे ?",
                                text:
                                  language === "en"
                                    ? "Are you sure you want to exit this Record ? "
                                    : "तुम्हाला खात्री आहे की तुम्ही या रेकॉर्डमधून बाहेर पडू इच्छिता ?",
                                icon: "warning",
                                buttons: {
                                  ok: language === "en" ? "Ok" : "ठीक आहे",
                                  cancel:
                                    language === "en" ? "Cancel" : "रद्द करा",
                                },
                                dangerMode: false,
                                closeOnClickOutside: false,
                              }).then((will) => {
                                if (will) {
                                  swal({
                                    text:
                                      language === "en"
                                        ? "Successfully Exited !"
                                        : "यशस्वीरित्या बाहेर पडलो !",
                                    icon: "success",
                                    button:
                                      language === "en" ? "Ok" : "ठीक आहे",
                                  });
                                  formPreviewDailogClose();
                                } else {
                                  swal({
                                    text:
                                      language === "en"
                                        ? "Record is Safe "
                                        : "रेकॉर्ड सुरक्षित आहे",
                                    icon: "success",
                                    button:
                                      language === "en" ? "Ok" : "ठीक आहे",
                                  });
                                }
                              });
                            }}
                          >
                            <FormattedLabel id="exit" />
                          </Button>
                        </Grid>
                      </DialogTitle>
                    </Dialog>
                  </>
                  {/* </div> */}
                </form>
              </FormProvider>
            </div>
          )}
        </Paper>
      </ThemeProvider>
    </>
  );
};

export default Index;
