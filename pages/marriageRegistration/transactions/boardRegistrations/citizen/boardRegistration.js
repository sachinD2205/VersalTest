import { ThemeProvider } from "@emotion/react";
import { yupResolver } from "@hookform/resolvers/yup";
import CloseIcon from "@mui/icons-material/Close";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Autocomplete,
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
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import urls from "../../../../../URLS/urls";
import Transliteration from "../../../../../components/common/linguosol/transliteration";
import UploadButton1 from "../../../../../components/marriageRegistration/DocumentsUploadDurgeOP";
import UploadButton from "../../../../../components/marriageRegistration/DocumentsUploadMB";
import HistoryComponent from "../../../../../components/marriageRegistration/HistoryComponent";
import Preview from "../../../../../components/marriageRegistration/Preview";
import styles from "../../../../../components/marriageRegistration/board.module.css";
import { boardschema } from "../../../../../components/marriageRegistration/schema/boardschema";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../../theme";
import sweetAlert from "sweetalert";
import Loader from "../../../../../containers/Layout/components/Loader";
import { catchExceptionHandlingMethod } from "../../../../../util/util";

const Index = (props) => {
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
  const [disableOwner, setDisableOwner] = useState(false);
  const language = useSelector((state) => state?.labels.language);
  let appName = "MR";
  let serviceName = "M-MBR";
  let applicationFrom = "online";
  const user = useSelector((state) => state?.user.user);
  let methodf;
  const [checked, setChecked] =useState(false);
  const methodsc = useForm({
    criteriaMode: "all",
    resolver: yupResolver(boardschema(language)),
    mode: "onChange",
    defaultValues: {
      id: null,
      wardKey: "",
      zoneKey: "",
      atitle: "",
      afName: "",
      amName: "",
      alName: "",
      afNameMr: "",
      amNameMr: "",
      alNameMr: "",

      aCflatBuildingNo: "",
      aCbuildingName: "",
      aCroadName: "",
      aCLandmark: "",
      aCCityName: "",
      aCPincode: "",

      aPflatBuildingNo: "",
      aPbuildingName: "",
      aProadName: "",
      aPLandmark: "",
      aPCityName: "",
      aPPincode: "",

      marriageBoardName: "",
      genderKey: "",
      bflatBuildingNo: "",
      bbuildingName: "",
      broadName: "",
      blandmark: "",
      bpincode: "",
      aadhaarNo: "",
      mobile: "",
      emailAddress: "",
      city: "",
      // validityOfMarriageBoardRegistration: null,
      remarks: "",
      serviceCharges: "",
      applicationAcceptanceCharges: "",
      applicationNumber: "",

      aCflatBuildingNoMr: "",
      aCbuildingNameMr: "",
      aCroadNameMr: "",
      aCLandmarkMr: "",
      aCCityNameMr: "",

      //marathi permanent

      aPflatBuildingNoMr: "",
      aPbuildingNameMr: "",
      aProadNameMr: "",
      aPLandmarkMr: "",
      aPCityNameMr: "",

      //marathi board

      marriageBoardNameMr: "",
      bflatBuildingNoMr: "",
      bbuildingNameMr: "",
      broadNameMr: "",
      blandmarkMr: "",
      cityMr: "",
      applicationNumber: "",
    },
  });

  const methodsd = useFormContext({
    criteriaMode: "all",
    resolver: yupResolver(boardschema(language)),
    mode: "onChange",
    defaultValues: {
      id: null,
      wardKey: "",
      zoneKey: "",
      atitle: "",
      afName: "",
      amName: "",
      alName: "",
      afNameMr: "",
      amNameMr: "",
      alNameMr: "",

      aCflatBuildingNo: "",
      aCbuildingName: "",
      aCroadName: "",
      aCLandmark: "",
      aCCityName: "",
      aCPincode: "",

      aPflatBuildingNo: "",
      aPbuildingName: "",
      aProadName: "",
      aPLandmark: "",
      aPCityName: "",
      aPPincode: "",

      marriageBoardName: "",
      genderKey: "",
      bflatBuildingNo: "",
      bbuildingName: "",
      broadName: "",
      blandmark: "",
      bpincode: "",
      aadhaarNo: "",
      mobile: "",
      emailAddress: "",
      city: "",
      // validityOfMarriageBoardRegistration: null,
      remarks: "",
      serviceCharges: "",
      applicationAcceptanceCharges: "",
      applicationNumber: "",

      aCflatBuildingNoMr: "",
      aCbuildingNameMr: "",
      aCroadNameMr: "",
      aCLandmarkMr: "",
      aCCityNameMr: "",

      //marathi permanent

      aPflatBuildingNoMr: "",
      aPbuildingNameMr: "",
      aProadNameMr: "",
      aPLandmarkMr: "",
      aPCityNameMr: "",

      //marathi board

      marriageBoardNameMr: "",
      bflatBuildingNoMr: "",
      bbuildingNameMr: "",
      broadNameMr: "",
      blandmarkMr: "",
      cityMr: "",
      applicationNumber: "",
    },
  });

  if (
    localStorage.getItem("loggedInUser") == "citizenUser" ||
    localStorage.getItem("loggedInUser") == "cfcUser"
  ) {
    methodf = methodsc;
  } else {
    methodf = methodsd;
  }

  const methods = methodf;

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

  console.log("methods", methods);
  const [btnSaveText, setBtnSaveText] = useState("Save");

  const router = useRouter();
  const [atitles, setatitles] = useState([]);
  const [pageMode, setPageMode] = useState(null);

  const [disable, setDisable] = useState(false);
  const [loader, setLoader] = useState(false);

  const [formPreviewDailog, setFormPreviewDailog] = useState(false);
  const formPreviewDailogOpen = () => setFormPreviewDailog(true);
  const formPreviewDailogClose = () => setFormPreviewDailog(false);

  // useEffect(() => {
  //   // if (watch('whoAreYou') == 1) {
  //   //   setValue("isApplicantGroom", true);
  //   // } else if (value.target.value == 2) {
  //   //   setValue("isApplicantBride", true);
  //   // }

  //   let flag1 =
  //     router.query.pageMode === "Add" || router.query.pageMode === "Edit";
  //   let flag2 =
  //     router.query.role == "DOCUMENT_VERIFICATION" ||
  //     router.query.role == "ADMIN";
  //   if (flag1 || flag2) {
  //     setDisabled(false);
  //     console.log("enabled");
  //     if (watch("zoneKey")) {
  //       setTemp(watch("zoneKey"));
  //     }
  //     setValue("astate", "Maharashtra");
  //     setValue("astateMr", "महाराष्ट्र");

  //     setValue("");
  //   } else {
  //     setDisabled(true);
  //     console.log("disabled");
  //     if (watch("zoneKey")) {
  //       setTemp(watch("zoneKey"));
  //     }
  //   }
  // }, []);

  //photo encryption

  const [encryptedFileNameToSend, setEncryptedFileNameToSend] = useState();
  const [encryptedBoardHeadPersonPhoto, setEncryptedBoardHeadPersonPhoto] = useState();
  const [encryptedBoardOrganizationPhoto, setEncryptedBoardOrganizationPhoto] = useState();
  const [encryptedPanCard, setEncryptedPanCard] = useState();
  const [encryptedAadharCard, setEncryptedAadharCard] = useState();
  const [encryptedRationCard, setEncryptedRationCard] = useState();
  const [encryptedElectricityBill, setEncryptedElectricityBill] = useState();
  const [encryptedResolutionOfBoard, setEncryptedResolutionOfBoard] = useState();
  const [encryptedReceiptOfPaymentOfpropertyTax, setEncryptedReceiptOfPaymentOfpropertyTax] = useState();
  const [encryptedAgreemenyCopyOfProperty, setEncryptedAgreemenyCopyOfProperty] = useState();
  const [encryptedOtherDoc, setEncryptedOtherDoc] = useState();

  useEffect(() => {
    console.log("disabled", router.query.pageMode);
    let flag1 =
      router.query.pageMode === "Add" || router.query.pageMode === "Edit";
    let flag2 =
      router.query.role == "DOCUMENT_VERIFICATION" ||
      router.query.role == "ADMIN";
    if (flag1 || flag2) {
      setPageMode(null);
      console.log("enabled", router.query.pageMode);
    } else if (
      router.query.pageMode == "Check" &&
      router.query.role != "DOCUMENT_VERIFICATION"
    ) {
      setDisable(true);
      setDisableOwner(true)
      setPageMode(router.query.pageMode);
    } else {
      setPageMode(router.query.pageMode);
      console.log("disabled", router.query.pageMode);
    }
  }, []);

  useEffect(()=>{
    if(checked){
      setDisableOwner(true)
    }else{
      setDisableOwner(false)
  
    }
  },[checked])
  let pageType = false;

  useEffect(() => {
    console.log("allvalues", getValues());
    console.log("vallll", props.accessValue);
    if (
      router.query.pageMode == "Edit" ||
      router.query.pageMode == "DOCUMENT CHECKLIST" ||
      router.query.pageMode == "Check" ||
      router.query.pageMode == "DOCUMENT CHECKLIST"
    ) {
      // reset(router.query)
      //  {props.accessValue &&
      axios
        .get(
          `${urls.MR}/transaction/marriageBoardRegistration/getapplicantById?applicationId=${router?.query?.id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((resp) => {
          console.log("viewEditMode", resp.data);
          reset(resp.data);
          setTemp(resp.data.zoneKey);

          // setValue("bLongitude", resp.data.blongitude);
          // setValue("atitlemr", resp.data.atitle);
          // setValue('wardKey',resp.data.wardKey)
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
      // .catch((err) => {
      //   swal(
      //     language == "en" ? "Error!" : "समस्या आहे!",
      //     language == "en"
      //       ? "Something problem with the searched Data !"
      //       : "शोधलेल्या डेटामध्ये काहीतरी समस्या आहे!",
      //     "error",

      //     // "Error!",
      //     // "Something problem with the searched Data !",
      //     // "error",
      //   );
      // });
    }
    // setFieldsDiabled(true)
    // }

    console.log("afterallvalues", getValues());
  }, []);

  useEffect(() => {
    console.log("errors555", errors);
  }, [errors]);

  // OnSubmit Form
  const onSubmitForm = (data) => {
    let userType;

    if (localStorage.getItem("loggedInUser") == "citizenUser") {
      userType = 1;
    } else if (localStorage.getItem("loggedInUser") == "departmentUser") {
      userType = 3;
    } else localStorage.getItem("loggedInUser") == "cfcUser";
    {
      userType = 2;
    }
    // const validityOfMarriageBoardRegistration = moment(
    //   data.validityOfMarriageBoardRegistration,
    //   'YYYY-MM-DD',
    // ).format('YYYY-MM-DD')
    setLoader(true);
    console.log("jml ka", watch("marriageBoardName"));

    const bodyForApi = {
      ...data,
      createdUserId: user?.id,
      applicationFrom,
      serviceCharges: null,
      serviceId: 67,
      applicantType: userType,
      id: Number(router?.query?.id),
      //file upload
      boardOrganizationPhoto: encryptedBoardOrganizationPhoto,
      boardHeadPersonPhoto: encryptedBoardHeadPersonPhoto,
      panCard: encryptedPanCard,
      aadharCard: encryptedAadharCard,
      rationCard: encryptedRationCard,
      electricityBill: encryptedElectricityBill,
      resolutionOfBoard: encryptedResolutionOfBoard,
      receiptOfPaymentOfpropertyTax: encryptedReceiptOfPaymentOfpropertyTax,
      agreemenyCopyOfProperty: encryptedAgreemenyCopyOfProperty,
      otherDoc: encryptedOtherDoc,
      // applicationNumber: router?.query?.applicationNumber,
      // applicationStatus: router?.query?.applicationStatus,

      // validityOfMarriageBoardRegistration,
    };
    const bodyForApiEdit = {
      ...data,
      createdUserId: user?.id,
      applicationFrom,
      serviceCharges: null,
      serviceId: 67,
      id: Number(router?.query?.id),
      activeFlag: "Y",
      applicantType: userType,
      //file upload
      boardOrganizationPhoto: encryptedBoardOrganizationPhoto,
      boardHeadPersonPhoto: encryptedBoardHeadPersonPhoto,
      panCard: encryptedPanCard,
      aadharCard: encryptedAadharCard,
      rationCard: encryptedRationCard,
      electricityBill: encryptedElectricityBill,
      resolutionOfBoard: encryptedResolutionOfBoard,
      receiptOfPaymentOfpropertyTax: encryptedReceiptOfPaymentOfpropertyTax,
      agreemenyCopyOfProperty: encryptedAgreemenyCopyOfProperty,
      otherDoc: encryptedOtherDoc,
      // applicationNumber: router?.query?.applicationNumber,
      // applicationStatus: router?.query?.applicationStatus,

      // validityOfMarriageBoardRegistration,
    };
    console.log("Final Data: ", btnSaveText, bodyForApi);

    // Save - DB
    if (btnSaveText === "Save") {
      axios
        .post(
          `${urls.MR}/transaction/marriageBoardRegistration/saveMarraigeBoardRegistration`,
          bodyForApi,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
          // allvalues,
        )
        .then((res) => {
          if (res.status == 201) {
            setLoader(false);
            // swal("Saved!", "Record Saved successfully !", "success");
            language == "en"
              ? sweetAlert({
                  title: "Saved!",
                  text: "Record Saved successfully!",
                  icon: "success",
                  button: "Ok",
                })
              : sweetAlert({
                  title: "जतन केले!",
                  text: "रेकॉर्ड यशस्वीरित्या जतन केले!",
                  icon: "success",
                  button: "ओके",
                });
            axios
              .get(
                `${
                  urls.MR
                }/transaction/marriageBoardRegistration/getapplicantById?applicationId=${
                  res?.data?.message?.split("$")[1]
                }`,
                {
                  headers: {
                    Authorization: `Bearer ${user.token}`,
                  },
                },
              )
              .then((resp) => {
                console.log("Save123", resp.data[0]);
                router.push({
                  pathname: `/marriageRegistration/Receipts/acknowledgmentReceiptmarathi`,
                  query: {
                    serviceId: 67,
                    id: res?.data?.message?.split("$")[1],
                  },
                });
              })
              .catch((error) => {
                callCatchMethod(error, language);
              });
            // .catch((err) => {
            //   // swal("Error!", "Somethings Wrong!", "error");
            //   swal(
            //     language == "en" ? "Error!" : "समस्या आहे!",
            //     language == "en" ? "Somethings Wrong!" : "काहीतरी चुकीचे !",
            //     "error",
            //   );
            // });
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
      // .catch((err) => {
      //   // swal("Error!", "Somethings Wrong Record not Saved!", "error");
      //   swal(
      //     language == "en" ? "Error!" : "समस्या आहे!",
      //     language == "en"
      //       ? "Somethings Wrong Record not Saved!"
      //       : "काहीतरी चुकीचे रेकॉर्ड जतन केले नाही!",
      //     "error",
      //   );
      // });
    } else if (router.query.pageMode === "Edit") {
      console.log("56", bodyForApiEdit);
      axios
        .post(
          `${urls.MR}/transaction/marriageBoardRegistration/saveMarraigeBoardRegistration`,
          bodyForApiEdit,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((res) => {
          setLoader(false);
          if (res.status == 201) {
            swal("Updated!", "Record Updated successfully !", "success");

            language == "en"
              ? sweetAlert({
                  title: "Updated!",
                  text: "Record Updated successfully !",
                  icon: "success",
                  button: "Ok",
                })
              : sweetAlert({
                  title: "अपडेट केले !",
                  text: "रेकॉर्ड यशस्वीरित्या अपडेट केले!",
                  icon: "success",
                  button: "ओके",
                });
          }
          router.push(`/marriageRegistration/transactions/boardRegistrations`);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
      // .catch((err) => {
      //   // swal("Error!", "Somethings Wrong Record not Updated!", "error");

      //   swal(
      //     language == "en" ? "Error!" : "समस्या आहे!",
      //     language == "en"
      //       ? "Somethings Wrong Record not Updated!"
      //       : "काहीतरी चुकीचे रेकॉर्ड अपडेट केले नाही!",
      //     "error",
      //   );
      // });
    }
  };

  //get by id

  useEffect(() => {
    console.log("vallll", props.accessValue);

    // if (router.query.pageMode == 'Edit' || router.query.pageMode == 'View') {
    if (
      router.query.pageMode !== "Add" &&
      router.query.pageMode !== "Edit" &&
      router.query.pageMode !== "Check"
    ) {
      if (router?.query?.id /* && props.accessValue */) {
        axios
          .get(
            `${urls.MR}/transaction/marriageBoardRegistration/getapplicantById?applicationId=${router?.query?.id}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            },
          )
          .then((resp) => {
            console.log("board data", resp.data);
            // console.log("viewEditMode", resp.data);
            // reset(resp.data);
            reset(resp.data);
            setTemp(resp.data.zoneKey);
          })
          .catch((error) => {
            callCatchMethod(error, language);
          });
        // .catch((err) => {
        //   // swal("Error!", "Somethings Wrong Record not Found!", "error");

        //   swal(
        //     language == "en" ? "Error!" : "समस्या आहे!",
        //     language == "en"
        //       ? "Something Wrong Record Not Found!"
        //       : "काहीतरी चुकीचे रेकॉर्ड सापडले नाही!",
        //     "error",
        //   );
        // });
      }
    } else {
      console.log("allv", router.query);
      console.log("allviagetVal", getValues());
      setTemp(getValues("zoneKey"));
      // if(props.accessValue){
      //   reset(router.query);
      // }
    }
  }, []);

  // const setWardZoneBasedOnArrray = () => {

  //   if (watch("areaKey")!=null) {
  //     let anotherFind = areaNames?.find(
  //       (data) => data?.uniqueId == watch("areaKey"),
  //     );
  //     console.log("filteredArrayZone1212", anotherFind);
  //     setValue("zoneKey", anotherFind?.zoneId);
  //    setValue("wardKey", anotherFind?.wardId);
  //   } else {
  //     setValue("zoneKey", null);
  //     setValue("wardKey", null);
  //   }
  // };
  //file upload

  const [fileName, setFileName] = useState(null);

  // zones
  const [temp, setTemp] = useState();
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  // const [isDataUpdated, setIsDataUpdated] = useState(authority?.includes("ADMIN")|| authority?.includes("DOCUMENT_VERIFICATION")?true:false);
  // const [tempData, setTempData] = useState(props.photos)
  // const [areaNames, setAreaNames] = useState([]);

  // const getAreas = async () => {
  //   await axios
  //     .get(`${urls.CFCURL}/master/zoneWardAreaMapping/getAlll`)
  //     .then((r) => {
  //       setAreaNames(r.data);
  //     });
  // };
  // const [zoneKeys, setZoneKeys] = useState([]);
  // // getZoneKeys
  // const getZoneKeys = () => {
  //   //setValues("setBackDrop", true);
  //   axios
  //     .get(`${urls.CFCURL}/master/zone/getAll`)
  //     .then((r) => {
  //       setZoneKeys(
  //         r.data.zone.map((row) => ({
  //           id: row.id,
  //           zoneName: row.zoneName,
  //           zoneNameMr: row.zoneNameMr,
  //         })),
  //       );
  //     })
  //     .catch((err) => {
  //       swal("Error!", "Somethings Wrong Zones not Found!", "error");
  //     });
  // };

  // wardKeys
  // const [wardKeys, setWardKeys] = useState([]);

  // // getWardKeys

  // const getWardKeys = async () => {
  //   await axios
  //     .get(
  //       `${
  //         urls.CFCURL
  //       }/master/ward/getAll`
  //     )
  //     .then((r) => {
  //       setWardKeys(
  //         r.data.ward.map((row) => ({
  //           id: row.id,
  //           wardName: row.wardName,
  //           wardNameMr: row.wardNameMr,
  //         }))
  //       );
  //     });
  // };

  // useEffect(() => {
  //   if (temp) getWardKeys();
  // }, [temp]);
  // genders
  const [genderKeys, setgenderKeys] = useState([]);

  // getgenderKeys
  const getgenderKeys = () => {
    axios
      .get(`${urls.CFCURL}/master/gender/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setgenderKeys(
          r.data.gender.map((row) => ({
            id: row.id,
            gender: row.gender,
            genderMr: row.genderMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // const [document, setDocument] = useState([])

  // // getGAgeProofDocumentKey
  // const getDocumentKey = () => {
  //   axios
  //     .get(`${urls.CFCURL}/master/serviceWiseChecklist/getAll`)
  //     .then((r) => {
  //       setDocument(r.data.serviceWiseChecklist)
  //     })
  //     .catch((err) => {
  //       swal('Error!', 'Somethings Wrong Document keys not Found!', 'error')
  //     })
  // }

  // useEffect(() => {
  //   getAreas();
  //   getZoneKeys();
  //   getTitles();
  //  getWardKeys();
  // }, [temp]);

  useEffect(() => {
    if (router?.query?.pageMode == "Add") {
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
      setValue("emailAddress", user.emailID);
      setValue("mobile", user.mobile);

      setValue("aflatBuildingNo", user.cflatBuildingNo);
      setValue("abuildingName", user.cbuildingName);
      setValue("aroadName", user.croadName);
      setValue("alandmark", user.clandmark);
      setValue("apincode", user.cpinCode);
      setValue("acityName", user.ccity);
      // setValue('astate', user.cState)

      setValue("aflatBuildingNoMr", user.cflatBuildingNoMr);
      setValue("abuildingNameMr", user.cbuildingNameMr);
      setValue("aroadNameMr", user.croadNameMr);
      setValue("alandmarkMr", user.clandmarkMr);
      setValue("acityNameMr", user.ccityMr);
      // setValue('astateMr', user.cStateMr)
      setValue("aemail", user.emailID);
      setValue("amobileNo", user.mobile);
    }
  }, [user]);

  const getTitles = async () => {
    await axios
      .get(`${urls.BaseURL}/title/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setatitles(
          r.data.title.map((row) => ({
            id: row.id,
            atitle: row.title,
            // titlemr: row.titlemr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  const [TitleMrs, setTitleMrs] = useState([]);
  const getTitleMr = async () => {
    await axios
      .get(`${urls.BaseURL}/title/getAll`)
      .then((r) => {
        setTitleMrs(
          r.data.title.map((row) => ({
            id: row.id,
            atitlemr: row.titleMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  useEffect(()=>{
    addressChange()
  },[checked])
    console.log("kjuytrertyuiytre", getValues("atitle"),checked);
    const handleChange = (event) => {
      setChecked(event.target.checked);
      // addressChange(event)
    };
    // Address Change
    const addressChange = () => {
      setValue("addressCheckBoxG",checked)
      // let condt = e;
      // setValue("addressCheckBoxG", condt);
      if (checked) {
      console.log("otitle", getValues("atitle"));
      setValue("otitle", getValues("atitle"));
      console.log("otitle1", watch("otitle"));

      setValue("ofName", getValues("afName"));
      setValue("omName", getValues("amName"));
      setValue("olName", getValues("alName"));

      setValue("otitlemr", getValues("atitlemr"));
      setValue("ofNameMr", getValues("afNameMr"));
      setValue("omNameMr", getValues("amNameMr"));
      setValue("olNameMr", getValues("alNameMr"));

      setValue("oflatBuildingNo", getValues("aflatBuildingNo"));
      setValue("obuildingName", getValues("abuildingName"));
      setValue("oroadName", getValues("aroadName"));
      setValue("olandmark", getValues("alandmark"));
      setValue("ocityName", getValues("acityName"));
      setValue("ostate", getValues("astate"));
      setValue("opincode", getValues("apincode"));
      setValue("omobileNo", getValues("amobileNo"));
      setValue("oemail", getValues("aemail"));

      setValue("oflatBuildingNoMr", getValues("aflatBuildingNoMr"));
      setValue("obuildingNameMr", getValues("abuildingNameMr"));
      setValue("oroadNameMr", getValues("aroadNameMr"));
      setValue("olandmarkMr", getValues("alandmarkMr"));
      setValue("ocityNameMr", getValues("acityNameMr"));
      setValue("ostateMr", getValues("astateMr"));
      setTemp(true);
    } else {
      setValue("otitle", null);
      // setValue('otitle', null)
      setValue("ofName", "");
      setValue("omName", "");
      setValue("olName", "");

      setValue("otitlemr", "");
      setValue("ofNameMr", "");
      setValue("omNameMr", "");
      setValue("olNameMr", "");

      setValue("oflatBuildingNo", "");
      setValue("obuildingName", "");
      setValue("oroadName", "");
      setValue("olandmark", "");
      setValue("ocityName", "");
      setValue("ostate", "");
      setValue("opincode", "");
      setValue("omobileNo", "");
      setValue("oemail", "");

      setValue("oflatBuildingNoMr", "");
      setValue("obuildingNameMr", "");
      setValue("oroadNameMr", "");
      setValue("olandmarkMr", "");
      setValue("ocityNameMr", "");
      setValue("ostateMr", "");
      setTemp();
    }
  };

  // useEffect(()=> {

  //   setValue("bflatBuildingNoMr",watch("bflatBuildingNo"))

  // },[watch("bflatBuildingNo")])

  // console.log("pratikshaKurkure1", getValues("marriageBoardName"));

  // ******************* area Zone ward***************************

  const [areaDropDown, setAreaDropDown] = useState([]);
  const [zoneDropDown, setZoneDropDown] = useState([]);
  const [wardDropDown, setWardDropDown] = useState([]);

  useEffect(() => {
    !router.query.id && getZones();

    axios
      .get(`${urls.CFCURL}/master/zoneWardAreaMapping/getAlll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setAreaDropDown(
          res.data?.map((j) => ({
            id: j?.area,
            zone: j?.zoneId,
            ward: j?.wardId,
            area: j?.areaId,
            areaDisplayNameEn:
              j?.areaName + " - " + j?.zoneName + " - " + j?.wardName,
            areaDisplayNameMr:
              j?.areaNameMr + " - " + j?.zoneNameMr + " - " + j?.wardNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    //Get Zone
    router.query.id &&
      axios
        .get(`${urls.CFCURL}/master/zone/getAll`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          setZoneDropDown(
            res.data.zone.map((j, i) => ({
              srNo: i + 1,
              id: j.id,
              zoneEn: j.zoneName,
              zoneMr: j.zoneNameMr,
            })),
          );
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    //Get Ward
    router.query.id &&
      axios
        .get(`${urls.CFCURL}/master/ward/getAll`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          setWardDropDown(
            res.data.ward.map((j, i) => ({
              srNo: i + 1,
              id: j.id,
              wardEn: j.wardName,
              wardMr: j.wardNameMr,
            })),
          );
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
  }, []);

  const getZones = () => {
    axios
      .get(`${urls.CFCURL}/master/zoneWardAreaMapping/getZoneByApplicationId`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) =>
        setZoneDropDown(
          res.data.map((zones) => ({
            id: zones.zoneId,
            zoneEn: zones.zoneName,
            zoneMr: zones.zoneNameMr,
          })),
        ),
      )
      .catch((error) => {
        {
          language == "en"
            ? sweetAlert("Error!", "Something went wrong", "error")
            : sweetAlert("त्रुटी!", "काहीतरी चूक झाली", "त्रुटी");
        }
        setLoader(false);
      });
  };
  const getWards = (zoneId) => {
    if (zoneId != null && zoneId != undefined && zoneId != "") {
      setLoader(true);
      axios
        .get(
          `${urls.CFCURL}/master/zoneWardAreaMapping/getWardByZoneAndModuleId`,
          {
            params: { zoneId },
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((res) => {
          setWardDropDown(
            res.data.map((wards) => ({
              id: wards.wardId,
              wardEn: wards.wardName,
              wardMr: wards.wardNameMr,
            })),
          );
          setLoader(false);
        })
        .catch((error) => {
          {
            language == "en"
              ? sweetAlert("Error!", "Something went wrong", "error")
              : sweetAlert("त्रुटी!", "काहीतरी चूक झाली", "त्रुटी");
          }
          setLoader(false);
        });
    }
  };

  const getAreas = (zoneId, wardId) => {
    setLoader(true);
    axios
      .get(
        `${urls.CFCURL}/master/zoneWardAreaMapping/getAreaByZoneAndWardAndModuleId`,
        { params: { zoneId, wardId } },
      )
      .then((res) => {
        setAreaDropDown(
          res.data.map((areas) => ({
            zone: areas?.zoneId,
            ward: areas?.wardId,
            area: areas?.areaId,
            id: areas?.areaId,
            areaDisplayNameEn:
              areas?.areaName +
              " - " +
              areas?.zoneName +
              " - " +
              areas?.wardName,
            areaDisplayNameMr:
              areas?.areaNamemr +
              " - " +
              areas?.zoneNameMr +
              " - " +
              areas?.wardNameMr,
          })),
        );
        setLoader(false);
      })
      .catch((error) => {
        {
          language == "en"
            ? sweetAlert("Error!", "Something went wrong", "error")
            : sweetAlert("त्रुटी!", "काहीतरी चूक झाली", "त्रुटी");
        }
        setLoader(false);
      });
  };
  useEffect(()=>{

    console.log("dsdf1", watch("boardHeadPersonPhoto"),encryptedBoardHeadPersonPhoto);
  },[watch("boardHeadPersonPhoto"),encryptedBoardHeadPersonPhoto])

  // view
  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <ThemeProvider theme={theme}>
          {/* <Box>
          <BreadcrumbComponent />
        </Box> */}
          <Paper
            sx={{
              marginLeft: 2,
              marginRight: 2,
              marginTop: 1,
              marginBottom: 2,
              padding: 1,
              border: 1,
              borderColor: "grey.500",
            }}
          >
            {router?.query?.pageMode == "Edit" ||
              (router?.query?.pageMode == "Check" && (
                <HistoryComponent
                  serviceId={67}
                  applicationId={router?.query?.id}
                />
              ))}
            <div>
              {router?.query?.pageMode != "Check" && (
                <div className={styles.details}>
                  <div className={styles.h1Tag}>
                    <h3
                      style={{
                        color: "white",
                        marginTop: "7px",
                      }}
                    >
                      {language == "en"
                        ? "Marriage Board Registration"
                        : "विवाह मंडळ नोंदणी"}
                    </h3>
                  </div>
                </div>
              )}
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <div className={styles.small}>
                    {!props.onlyDoc && (
                      <>
                        <Grid
                          container
                          // xs={12}
                          // sm={12}
                          // md={12}
                          // style={{
                          //   display: "flex",
                          //   justifyContent: "center",
                          //   alignItems: "center",
                          // }}
                        >
                          <Grid
                            container
                            xs={12}
                            sm={6}
                            md={6}
                            lg={3}
                            xl={3}
                            style={{
                              // display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <FormControl
                              variant="standard"
                              sx={{ marginTop: "0" }}
                              // error={!!error.areaKey}
                            >
                              {/* <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='area' />
              </InputLabel> */}
                              {/* <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: '250px' }}
                    labelId='demo-simple-select-standard-label'
                    id='demo-simple-select-standard'
                    // @ts-ignore
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value)
                      let tempObjForZoneAndWard = areaDropDown?.find(
                        (j) => j?.area == value.target.value
                      )
                      getWards(tempObjForZoneAndWard?.zone)
                      setValue('zoneKey', tempObjForZoneAndWard?.zone)
                      setValue('wardKey', tempObjForZoneAndWard?.ward)
                    }}
                    label='areaKey'
                  >
                    {areaDropDown &&
                      areaDropDown.map((value) => (
                        <MenuItem
                          key={value?.id}
                          value={
                            //@ts-ignore
                            value?.area
                          }
                        >
                          {language == 'en'
                            ? //@ts-ignore
                              value?.areaDisplayNameEn
                            : // @ts-ignore
                              value?.areaDisplayNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='areaKey'
                control={control}
                defaultValue=''
              /> */}
                              <Controller
                                render={({ field }) => (
                                  <Autocomplete
                                    variant="standard"
                                    disabled={disable}
                                    sx={{
                                      width: "250px",
                                      ".mui-style-178bwih-MuiFormControl-root-MuiTextField-root":
                                        { marginTop: 0 },
                                    }}
                                    id="demo-autocomplete-standard"
                                    options={areaDropDown || []} // Make sure areaDropDown is an array or provide a default empty array if it can be null/undefined
                                    value={
                                      areaDropDown.find(
                                        (option) => option.area === field.value,
                                      ) || null
                                    } // Find the corresponding option based on field value
                                    onChange={(_, value) => {
                                      field.onChange(value ? value.area : ""); // Update field value with the selected option's area
                                      let tempObjForZoneAndWard =
                                        areaDropDown?.find(
                                          (j) => j?.area === value?.area,
                                        );
                                      getWards(tempObjForZoneAndWard?.zone);
                                      setValue(
                                        "zoneKey",
                                        tempObjForZoneAndWard?.zone,
                                      );
                                      setValue(
                                        "wardKey",
                                        tempObjForZoneAndWard?.ward,
                                      );
                                    }}
                                    getOptionLabel={(option) =>
                                      language === "en"
                                        ? option.areaDisplayNameEn
                                        : option.areaDisplayNameMr
                                    }
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        variant="standard"
                                        label={
                                          language != "en" ? "क्षेत्र" : "Area"
                                        }
                                      />
                                    )}
                                  />
                                )}
                                name="areaKey"
                                control={control}
                                defaultValue=""
                              />
                            </FormControl>
                          </Grid>
                          <Grid
                            container
                            xs={12}
                            sm={6}
                            md={6}
                            lg={3}
                            xl={3}
                            style={{
                              // display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <FormControl
                              disabled={disable}
                              variant="standard"
                              // error={!!error.zoneKey}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                <FormattedLabel id="zone" required />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    sx={{ width: "250px" }}
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    // @ts-ignore
                                    value={field.value}
                                    onChange={(value) => {
                                      field.onChange(value);
                                      !router.query.id &&
                                        getWards(value.target.value);
                                      !router.query.id &&
                                        setValue("wardKey", "");
                                      !router.query.id &&
                                        setValue("areaKey", "");
                                    }}
                                    label="zoneKey"
                                  >
                                    {zoneDropDown &&
                                      zoneDropDown.map((value, index) => (
                                        <MenuItem
                                          key={index}
                                          value={
                                            //@ts-ignore
                                            value?.id
                                          }
                                        >
                                          {language == "en"
                                            ? //@ts-ignore
                                              value?.zoneEn
                                            : // @ts-ignore
                                              value?.zoneMr}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                name="zoneKey"
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText>
                                {/* {error?.zoneKey ? error.zoneKey.message : null} */}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          <Grid
                            container
                            xs={12}
                            sm={6}
                            md={6}
                            lg={3}
                            xl={3}
                            style={{
                              // display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <FormControl
                              disabled={disable}
                              variant="standard"
                              // error={!!error.wardKey}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                <FormattedLabel id="ward" required />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    sx={{ width: "250px" }}
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    // @ts-ignore
                                    value={field.value}
                                    onChange={(value) => {
                                      field.onChange(value);
                                      !router.query.id &&
                                        getAreas(
                                          watch("zoneKey"),
                                          value.target.value,
                                        );
                                    }}
                                    label="wardKey"
                                  >
                                    {wardDropDown &&
                                      wardDropDown.map((value, index) => (
                                        <MenuItem
                                          key={index}
                                          value={
                                            //@ts-ignore
                                            value.id
                                          }
                                        >
                                          {language == "en"
                                            ? //@ts-ignore
                                              value.wardEn
                                            : // @ts-ignore
                                              value?.wardMr}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                name="wardKey"
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText>
                                {/* {error?.wardKey ? error.wardKey.message : null} */}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          {/* <AreaWardZoneMapping /> */}
                          {/* <Grid
          container
          xs={12}
          sm={12}
          md={4}
          lg={3}
          xl={3}
          style={{
          //   display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <FormControl
              variant="standard"
              // sx={{ marginTop: 1 }}
              error={!!errors.areaKey}
              disabled={disable}
            >
              <Controller
                //! Sachin_😴
                name="areaKey"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                  disabled={disable}
                    id="controllable-states-demo"
                    variant="standard"
                    onChange={(event, newValue) => {
                      setValue("uniqueId", newValue?.uniqueId);
                      onChange(newValue ? newValue?.uniqueId : null);
                      setWardZoneBasedOnArrray();
                    }}
                    value={
                      areaNames?.find((data) => data?.uniqueId === value) ||
                      null
                    }
                    options={areaNames} //! api Data
                    getOptionLabel={(areaName) =>
                      language == "en"
                        ? areaName?.areaName +
                          " - " +
                          areaName?.zoneName +
                          " - " +
                          areaName?.wardName
                        : areaName?.areaNameMr +
                          " - " +
                          areaName?.zoneNameMr +
                          " -" +
                          areaName?.wardNameMr
                    }
                    //! Display name the Autocomplete
                    renderInput={(params) => (
                      <TextField
                      // disabled={disable}
                        variant="standard"
                        sx={{
                          m: { xs: 0, md: 1 },
                          minWidth: "100%",
                        }}
                        {...params}
                        label={language == "en" ? "Area Name" : "Area Name"}
                      />
                    )}
                  />
                )}
              />
            </FormControl>
          </div>
</Grid>
<Grid
          container
          xs={12}
          sm={12}
          md={4}
          lg={3}
          xl={3}
          style={{
            // display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <FormControl
              variant="standard"
              sx={{ marginTop: 1 }}
              error={!!errors.zoneKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="zone" required />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                  disabled={disable}
                    // autoFocus
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);

                      setTemp(value.target.value);
                    }}
                    label="Zone Name *"
                  >
                    {zoneKeys &&
                      zoneKeys.map((zoneKey, index) => (
                        <MenuItem key={index} value={zoneKey.id}>
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
          </div>
          </Grid>
          <Grid
          container
          xs={12}
          sm={12}
          md={4}
          lg={3}
          xl={3}
          style={{
            // display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <FormControl
              variant="standard"
              sx={{ marginTop: 1 }}
              error={!!errors.wardKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="ward" required />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                  disabled={disable}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Ward Name *"
                  >
                    {wardKeys &&
                      wardKeys.map((wardKey, index) => (
                        <MenuItem key={index} value={wardKey.id}>
                          {language == "en"
                            ? wardKey?.wardName
                            : wardKey?.wardNameMr}
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
          </div>
          </Grid> */}
                          <Grid
                            container
                            xs={12}
                            sm={6}
                            md={6}
                            lg={3}
                            xl={3}
                            style={{
                              // display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <div>
                              <FormControl
                                sx={{
                                  width: "250px",
                                  // marginTop: "5px",
                                }}
                                variant="standard"
                                error={!!errors.isPersonOrgansation}
                              >
                                {/* <FormControl> */}
                                <InputLabel>
                                <FormattedLabel id="boardType" required />
                                </InputLabel>
                                <Controller
                                  name="isPersonOrgansation"
                                  control={control}
                                  defaultValue=""
                                  render={({ field }) => (
                                    <Select {...field} disabled={disable}>
                                      <MenuItem value={"individual"}>
                                        {language == "en"
                                          ? "Individual"
                                          : "वैयक्तीक "}
                                      </MenuItem>
                                      <MenuItem value={"organisation"}>
                                        {language == "en"
                                          ? "Organisation"
                                          : "विश्वस्त संस्था  "}
                                      </MenuItem>
                                      {/* <MenuItem value="option3">Option 4</MenuItem> */}
                                    </Select>
                                  )}
                                />
                                <FormHelperText>
                                  {errors?.isPersonOrgansation
                                    ? errors.isPersonOrgansation.message
                                    : null}
                                </FormHelperText>
                              </FormControl>
                            </div>
                          </Grid>
                        </Grid>
                        {/* <Paper
                        style={{
                          backgroundColor: "RGB(240, 240, 240)",
                        }}
                      >
                        <div
                          className={styles.wardZone}
                          style={{ alignItems: "center" }}
                        >
                          <div>
                            <FormControl
                              variant="standard"
                              sx={{ marginTop: 2 }}
                              error={!!errors.zoneKey}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                <FormattedLabel id="zone" required />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    //sx={{ width: 250 }}
                                    disabled={disable}
                                    value={field.value}
                                    onChange={(value) => {
                                      field.onChange(value);
                                      console.log(
                                        "Zone Key: ",
                                        value.target.value,
                                      );
                                      setTemp(value.target.value);
                                    }}
                                    label="Zone Name  "
                                  >
                                    {zoneKeys &&
                                      zoneKeys.map((zoneKey, index) => (
                                        <MenuItem
                                          key={index}
                                          value={zoneKey.id}
                                        >
                                          
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
                                {errors?.zoneKey
                                  ? errors.zoneKey.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </div>
                          <div className={styles.wardZone}>
                            {console.log(watch("wardKey"),"dszfsdf")}
                            <FormControl
                              variant="standard"
                              sx={{ marginTop: 2 }}
                              error={!!errors.wardKey}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                <FormattedLabel id="ward" required />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    disabled={disable}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    label="Ward Name  "
                                  >
                                    {wardKeys &&
                                      wardKeys.map((wardKey, index) => (
                                        <MenuItem
                                          key={index}
                                          value={wardKey.id}
                                        >
                                          
                                          {language == "en"
                                            ? wardKey?.wardName
                                            : wardKey?.wardNameMr}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                name="wardKey"
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText>
                                {errors?.wardKey
                                  ? errors.wardKey.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </div>
                        </div>
                      </Paper> */}

                        <div className={styles.details}>
                          <div className={styles.h1Tag}>
                            <h3
                              style={{
                                color: "white",
                                marginTop: "7px",
                              }}
                            >
                              {<FormattedLabel id="applicantName" />}
                            </h3>
                          </div>
                        </div>
                        <div className={styles.row}>
                          {/* <div style={{ marginTop: "3vh" }}>
                          <FormControl
                            variant="standard"
                            error={!!errors.atitle}
                            sx={{ width: "250px" }}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="titleInenglish" required />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  // disabled
                                  disabled={disable}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Title  "
                                  id="demo-simple-select-standard"
                                  labelId="id='demo-simple-select-standard-label'"
                                >
                                  {atitles &&
                                    atitles.map((atitle, index) => (
                                      <MenuItem key={index} value={atitle.id}>
                                        {atitle.atitle}
                                       
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
                        </div> */}

                          <div style={{ marginTop: "3vh" }}>
                            {/* <TextField
                            disabled={disable}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="firstName" required />}
                            // label="First Name *"
                            variant="standard"
                            {...register("afName")}
                            error={!!errors.afName}
                            helperText={errors?.afName ? errors.afName.message : null}
                          /> */}

                            <Transliteration
                              disabled={disable}
                              _key={"afName"}
                              labelName={"firstName"}
                              fieldName={"afName"}
                              updateFieldName={"afNameMr"}
                              sourceLang={"eng"}
                              targetLang={"mar"}
                              width={250}
                              label={<FormattedLabel id="firstName" required />}
                              error={!!errors.afName}
                              helperText={
                                errors?.afName ? errors.afName.message : null
                              }
                            />
                          </div>

                          <div style={{ marginTop: "3vh" }}>
                            {/* <TextField
                            //  disabled
                            disabled={disable}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            // label="Middle Name *"
                            label={<FormattedLabel id="middleName" required />}
                            variant="standard"
                            {...register("amName")}
                            error={!!errors.amName}
                            helperText={
                              errors?.amName ? errors.amName.message : null
                            }
                          /> */}
                            <Transliteration
                              disabled={disable}
                              _key={"amName"}
                              labelName={"middleName"}
                              fieldName={"amName"}
                              updateFieldName={"amNameMr"}
                              sourceLang={"eng"}
                              targetLang={"mar"}
                              width={250}
                              label={
                                <FormattedLabel id="middleName" required />
                              }
                              error={!!errors.amName}
                              helperText={
                                errors?.amName ? errors.amName.message : null
                              }
                            />
                          </div>
                          <div style={{ marginTop: "3vh" }}>
                            {/* <TextField
                            // disabled
                            disabled={disable}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            // label="Last Name *"
                            label={<FormattedLabel id="lastName" required />}
                            variant="standard"
                            {...register("alName")}
                            error={!!errors.alName}
                            helperText={
                              errors?.alName ? errors.alName.message : null
                            }
                          /> */}
                            <Transliteration
                              disabled={disable}
                              _key={"alName"}
                              labelName={"lastName"}
                              fieldName={"alName"}
                              updateFieldName={"alNameMr"}
                              sourceLang={"eng"}
                              targetLang={"mar"}
                              width={250}
                              label={<FormattedLabel id="lastName" required />}
                              error={!!errors.alName}
                              helperText={
                                errors?.alName ? errors.alName.message : null
                              }
                            />
                          </div>
                        </div>
                        <div className={styles.row}>
                          {/* <div style={{ marginTop: "3vh" }}>
                          <FormControl
                            variant="standard"
                            error={!!errors.atitlemr}
                            sx={{ width: "250px" }}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="titleInmarathi" required />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  // disabled
                                  disabled={disable}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Title  "
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
                        </div> */}

                          <div style={{ marginTop: "3vh" }}>
                            {/* <TextField
                            //  disabled
                            disabled={disable}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            // label="प्रथम नावं *"
                            label={<FormattedLabel id="firstNamemr" required />}
                            // label=" Hello"
                            variant="standard"
                            {...register("afNameMr")}
                            error={!!errors.afNameMr}
                            helperText={
                              errors?.afNameMr ? errors.afNameMr.message : null
                            }
                          /> */}
                            <Transliteration
                              disabled={disable}
                              _key={"afNameMr"}
                              labelName={"firstNamemr"}
                              fieldName={"afNameMr"}
                              updateFieldName={"afName"}
                              sourceLang={"mar"}
                              targetLang={"eng"}
                              width={250}
                              label={
                                <FormattedLabel id="firstNamemr" required />
                              }
                              error={!!errors.afNameMr}
                              helperText={
                                errors?.afNameMr
                                  ? errors.afNameMr.message
                                  : null
                              }
                            />
                          </div>

                          <div style={{ marginTop: "3vh" }}>
                            {/* <TextField
                            //  disabled
                            disabled={disable}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            //label="Middle Name *"
                            label={
                              <FormattedLabel id="middleNamemr" required />
                            }
                            // label="मधले नावं *"
                            variant="standard"
                            {...register("amNameMr")}
                            error={!!errors.amNameMr}
                            helperText={
                              errors?.amNameMr ? errors.amNameMr.message : null
                            }
                          /> */}

                            <Transliteration
                              disabled={disable}
                              _key={"amNameMr"}
                              labelName={"middleNamemr"}
                              fieldName={"amNameMr"}
                              updateFieldName={"amName"}
                              sourceLang={"mar"}
                              targetLang={"eng"}
                              width={250}
                              label={
                                <FormattedLabel id="middleNamemr" required />
                              }
                              error={!!errors.amNameMr}
                              helperText={
                                errors?.amNameMr
                                  ? errors.amNameMr.message
                                  : null
                              }
                            />
                          </div>
                          <div style={{ marginTop: "3vh" }}>
                            {/* <TextField
                            // disabled
                            disabled={disable}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            //label="Last Name *"
                            label={<FormattedLabel id="lastNamemr" required />}
                            // label="आडनाव *"
                            variant="standard"
                            {...register("alNameMr")}
                            error={!!errors.alNameMr}
                            helperText={
                              errors?.alNameMr ? errors.alNameMr.message : null
                            }
                          /> */}
                            <Transliteration
                              disabled={disable}
                              _key={"alNameMr"}
                              labelName={"lastNamemr"}
                              fieldName={"alNameMr"}
                              updateFieldName={"alName"}
                              sourceLang={"mar"}
                              targetLang={"eng"}
                              width={250}
                              label={
                                <FormattedLabel id="lastNamemr" required />
                              }
                              error={!!errors.alNameMr}
                              helperText={
                                errors?.alNameMr
                                  ? errors.alNameMr.message
                                  : null
                              }
                            />
                          </div>
                        </div>

                        <div className={styles.details}>
                          <div className={styles.h1Tag}>
                            <h3
                              style={{
                                color: "white",
                                marginTop: "7px",
                              }}
                            >
                              {<FormattedLabel id="Addrees" />}
                            </h3>
                          </div>
                        </div>

                        <div className={styles.row}>
                          <div>
                            <TextField
                              //  disabled
                              disabled={disable}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              sx={{ width: 250 }}
                              id="standard-basic"
                              label={<FormattedLabel id="flatBuildingNo" />}
                              variant="standard"
                              {...register("aflatBuildingNo")}
                              error={!!errors.aflatBuildingNo}
                              helperText={
                                errors?.aflatBuildingNo
                                  ? errors.aflatBuildingNo.message
                                  : null
                              }
                            />
                          </div>

                          <div style={{ marginTop: "3vh" }}>
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
                            variant="standard"
                            {...register("abuildingName")}
                            error={!!errors.abuildingName}
                            helperText={
                              errors?.abuildingName
                                ? errors.abuildingName.message
                                : null
                            }
                          /> */}

                            <Transliteration
                              disabled={disable}
                              _key={"abuildingName"}
                              labelName={"buildingName"}
                              fieldName={"abuildingName"}
                              updateFieldName={"abuildingNameMr"}
                              sourceLang={"eng"}
                              targetLang={"mar"}
                              width={250}
                              label={<FormattedLabel id="buildingName" />}
                              error={!!errors.abuildingName}
                              helperText={
                                errors?.abuildingName
                                  ? errors.abuildingName.message
                                  : null
                              }
                            />
                          </div>

                          <div style={{ marginTop: "3vh" }}>
                            {/* <TextField
                            //  disabled
                            disabled={disable}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="roadName" required />}
                            variant="standard"
                            {...register("aroadName")}
                            error={!!errors.aroadName}
                            helperText={
                              errors?.aroadName
                                ? errors.aroadName.message
                                : null
                            }
                          /> */}

                            <Transliteration
                              disabled={disable}
                              _key={"aroadName"}
                              labelName={"roadName"}
                              fieldName={"aroadName"}
                              updateFieldName={"aroadNameMr"}
                              sourceLang={"eng"}
                              targetLang={"mar"}
                              width={250}
                              label={<FormattedLabel id="roadName" required />}
                              error={!!errors.aroadName}
                              helperText={
                                errors?.aroadName
                                  ? errors.aroadName.message
                                  : null
                              }
                            />
                          </div>
                        </div>
                        <div className={styles.row3}>
                          <div style={{ marginTop: "3vh" }}>
                            {/* <TextField
                            //  disabled
                            disabled={disable}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="Landmark" required />}
                            variant="standard"
                            {...register("alandmark")}
                            error={!!errors.alandmark}
                            helperText={
                              errors?.alandmark
                                ? errors.alandmark.message
                                : null
                            }
                          /> */}
                            <Transliteration
                              disabled={disable}
                              _key={"alandmark"}
                              labelName={"Landmark"}
                              fieldName={"alandmark"}
                              updateFieldName={"alandmarkMr"}
                              sourceLang={"eng"}
                              targetLang={"mar"}
                              width={250}
                              label={<FormattedLabel id="Landmark" required />}
                              error={!!errors.alandmark}
                              helperText={
                                errors?.alandmark
                                  ? errors.alandmark.message
                                  : null
                              }
                            />
                          </div>

                          <div style={{ marginTop: "3vh" }}>
                            {/* <TextField
                            //  disabled
                            disabled={disable}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="cityName" required />}
                            variant="standard"
                            {...register("acityName")}
                            error={!!errors.acityName}
                            helperText={
                              errors?.acityName
                                ? errors.acityName.message
                                : null
                            }
                          /> */}

                            <Transliteration
                              disabled={disable}
                              _key={"acityName"}
                              labelName={"cityName"}
                              fieldName={"acityName"}
                              updateFieldName={"acityNameMr"}
                              sourceLang={"eng"}
                              targetLang={"mar"}
                              width={250}
                              label={<FormattedLabel id="cityName" required />}
                              error={!!errors.acityName}
                              helperText={
                                errors?.acityName
                                  ? errors.acityName.message
                                  : null
                              }
                            />
                          </div>

                          <div>
                            <TextField
                              disabled={disable}
                              defaultValue="Maharashtra"
                              //  disabled
                              // disabled={disable}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              sx={{ width: 250 }}
                              id="standard-basic"
                              label={<FormattedLabel id="State" required />}
                              variant="standard"
                              {...register("astate")}
                              error={!!errors.astate}
                              helperText={
                                errors?.astate ? errors.astate.message : null
                              }
                            />

                            {/* <Transliteration
                            _key={"astate"}
                            labelName={"State"}
                            fieldName={"astate"}
                            updateFieldName={"astateMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            width={250}
                            label={<FormattedLabel id="State" required />}
                            error={!!errors.astate}
                            helperText={
                              errors?.astate ? errors.astate.message : null
                            }
                          /> */}
                          </div>
                        </div>

                        {/* marathi Adress */}

                        <div className={styles.row}>
                          <div>
                            <TextField
                              disabled={disable}
                              sx={{ width: 250 }}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              id="standard-basic"
                              label={<FormattedLabel id="flatBuildingNomr" />}
                              variant="standard"
                              //  value={`${this.state.pflatBuildingNo},${this.state.cflatBuildingNo}`}
                              //  value={pflatBuildingNo}
                              // onChange={(e) => setValue(e.target.pflatBuildingNo)}
                              {...register("aflatBuildingNoMr")}
                              error={!!errors.aflatBuildingNoMr}
                              helperText={
                                errors?.aflatBuildingNoMr
                                  ? errors.aflatBuildingNoMr.message
                                  : null
                              }
                            />
                          </div>

                          <div style={{ marginTop: "3vh" }}>
                            {/* <TextField
                            //  disabled
                            disabled={disable}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={
                              <FormattedLabel id="buildingNamemr" required />
                            }
                            variant="standard"
                            {...register("abuildingNameMr")}
                            error={!!errors.abuildingNameMr}
                            helperText={
                              errors?.abuildingNameMr
                                ? errors.abuildingNameMr.message
                                : null
                            }
                          /> */}

                            <Transliteration
                              disabled={disable}
                              _key={"abuildingNameMr"}
                              labelName={"buildingNamemr"}
                              fieldName={"abuildingNameMr"}
                              updateFieldName={"abuildingName"}
                              sourceLang={"mar"}
                              targetLang={"eng"}
                              width={250}
                              label={<FormattedLabel id="buildingNamemr" />}
                              error={!!errors.abuildingNameMr}
                              helperText={
                                errors?.abuildingNameMr
                                  ? errors.abuildingNameMr.message
                                  : null
                              }
                            />
                          </div>

                          <div style={{ marginTop: "3vh" }}>
                            {/* <TextField
                            //  disabled
                            disabled={disable}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="roadNamemr" required />}
                            // label="गल्लीचे नाव"
                            variant="standard"
                            {...register("aroadNameMr")}
                            error={!!errors.aroadNameMr}
                            helperText={
                              errors?.aroadNameMr
                                ? errors.aroadNameMr.message
                                : null
                            }
                          /> */}
                            <Transliteration
                              disabled={disable}
                              _key={"aroadNameMr"}
                              labelName={"roadNamemr"}
                              fieldName={"aroadNameMr"}
                              updateFieldName={"aroadName"}
                              sourceLang={"mar"}
                              targetLang={"eng"}
                              width={250}
                              label={
                                <FormattedLabel id="roadNamemr" required />
                              }
                              error={!!errors.aroadNameMr}
                              helperText={
                                errors?.aroadNameMr
                                  ? errors.aroadNameMr.message
                                  : null
                              }
                            />
                          </div>
                        </div>
                        <div className={styles.row3}>
                          <div style={{ marginTop: "3vh" }}>
                            {/* <TextField
                            //  disabled
                            disabled={disable}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="Landmarkmr" required />}
                            // label="जमीन चिन्ह"
                            variant="standard"
                            {...register("alandmarkMr")}
                            error={!!errors.alandmarkMr}
                            helperText={
                              errors?.alandmarkMr
                                ? errors.alandmarkMr.message
                                : null
                            }
                          /> */}
                            <Transliteration
                              disabled={disable}
                              _key={"alandmarkMr"}
                              labelName={"Landmarkmr"}
                              fieldName={"alandmarkMr"}
                              updateFieldName={"alandmark"}
                              sourceLang={"mar"}
                              targetLang={"eng"}
                              width={250}
                              label={
                                <FormattedLabel id="Landmarkmr" required />
                              }
                              error={!!errors.alandmarkMr}
                              helperText={
                                errors?.alandmarkMr
                                  ? errors.alandmarkMr.message
                                  : null
                              }
                            />
                          </div>

                          <div style={{ marginTop: "3vh" }}>
                            {/* <TextField
                            //  disabled
                            disabled={disable}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="cityNamemr" required />}
                            // label="शहराचे नाव"
                            variant="standard"
                            {...register("acityNameMr")}
                            error={!!errors.acityNameMr}
                            helperText={
                              errors?.acityNameMr
                                ? errors.acityNameMr.message
                                : null
                            }
                          /> */}

                            <Transliteration
                              disabled={disable}
                              _key={"acityNameMr"}
                              labelName={"cityNamemr"}
                              fieldName={"acityNameMr"}
                              updateFieldName={"acityName"}
                              sourceLang={"mar"}
                              targetLang={"eng"}
                              width={250}
                              label={
                                <FormattedLabel id="cityNamemr" required />
                              }
                              error={!!errors.acityNameMr}
                              helperText={
                                errors?.acityNameMr
                                  ? errors.acityNameMr.message
                                  : null
                              }
                            />
                          </div>

                          <div>
                            <TextField
                              disabled={disable}
                              defaultValue="महाराष्ट्र"
                              // disabled
                              InputLabelProps={{
                                shrink: true,
                              }}
                              sx={{ width: 250 }}
                              id="standard-basic"
                              label={<FormattedLabel id="statemr" required />}
                              variant="standard"
                              {...register("astateMr")}
                              error={!!errors.astateMr}
                              helperText={
                                errors?.astateMr
                                  ? errors.astateMr.message
                                  : null
                              }
                            />
                            {/* <Transliteration
                            _key={"astateMr"}
                            labelName={"statemr"}
                            fieldName={"astateMr"}
                            updateFieldName={"astate"}
                            sourceLang={"mar"}
                            width={250}
                            targetLang={"eng"}
                            label={<FormattedLabel id="statemr" required />}
                            error={!!errors.astateMr}
                            helperText={
                              errors?.astateMr ? errors.astateMr.message : null
                            }
                          /> */}
                          </div>
                        </div>
                        <div className={styles.row}>
                          <div>
                            <TextField
                              //  disabled
                              inputProps={{ maxLength: 6 }}
                              disabled={disable}
                              InputLabelProps={{ shrink: true }}
                              sx={{ width: 250 }}
                              id="standard-basic"
                              label={<FormattedLabel id="pincode" required />}
                              variant="standard"
                              {...register("apincode")}
                              error={!!errors.apincode}
                              helperText={
                                errors?.apincode
                                  ? errors.apincode.message
                                  : null
                              }
                            />
                          </div>
                          <div>
                            <TextField
                              disabled={disable}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              sx={{ width: 250 }}
                              id="standard-basic"
                              label={<FormattedLabel id="mobileNo" required />}
                              variant="standard"
                              inputProps={{ maxLength: 10 }}
                              // value={pageType ? router.query.mobile : ''}
                              // disabled={router.query.pageMode === 'View'}
                              {...register("amobileNo")}
                              error={!!errors.amobileNo}
                              helperText={
                                errors?.amobileNo
                                  ? errors.amobileNo.message
                                  : null
                              }
                            />
                          </div>

                          <div>
                            <TextField
                              disabled={disable}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              sx={{ width: 250 }}
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
                          </div>
                        </div>

                        {/* owner details */}

                        <div className={styles.details}>
                          <div className={styles.h1Tag}>
                            <h3
                              style={{
                                color: "white",
                                marginTop: "7px",
                              }}
                            >
                              {<FormattedLabel id="OwnerDetails" required />}
                              {/* Owner Details : */}
                            </h3>
                          </div>
                        </div>

                        {!disable ? (
                          <div style={{ marginLeft: "25px" }}>
                            <FormControlLabel
                              // disabled={
                              //   getValues('addressCheckBoxB') ||
                              //   router?.query?.pageMode === 'View' ||
                              //   router?.query?.pageMode === 'Edit'
                              // }
                              control={
                                <Checkbox
                                  // checked={
                                  //   getValues("addressCheckBoxG") ? true : false
                                  // }
                                  checked={checked}
                                />
                              }
                              label=<Typography>
                                <b>
                                  {" "}
                                  <FormattedLabel id="OwnerChkeck" />
                                </b>
                              </Typography>
                              {...register("addressCheckBoxG")}
                              // onChange={(e) => {
                              //   addressChange(e);
                              // }}
                              onChange={handleChange}
                            />
                          </div>
                        ) : (
                          ""
                        )}
                        <div className={styles.row}>
                          {/* <div style={{ marginTop: "3vh" }}>
                          <FormControl
                            variant="standard"
                            error={!!errors.otitle}
                            sx={{ width: "250px" }}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="title1" required />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  // disabled
                                  disabled={disable}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Title  "
                                  id="demo-simple-select-standard"
                                  labelId="id='demo-simple-select-standard-label'"
                                >
                                  {atitles &&
                                    atitles.map((atitle, index) => (
                                      <MenuItem key={index} value={atitle.id}>
                                        {atitle.atitle}
                                       
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="otitle"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.otitle ? errors.otitle.message : null}
                            </FormHelperText>
                          </FormControl>
                        </div> */}

                          <div>
                            {/* <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            disabled={disable}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="firstName" required />}
                            // label="First Name *"
                            variant="standard"
                            {...register("ofName")}
                            error={!!errors.ofName}
                            helperText={
                              errors?.ofName ? errors.ofName.message : null
                            }
                          /> */}
                            <Transliteration
                              disabled={disableOwner}
                              _key={"ofName"}
                              labelName={"firstName"}
                              fieldName={"ofName"}
                              updateFieldName={"ofNameMr"}
                              sourceLang={"eng"}
                              targetLang={"mar"}
                              targetError={"ofNameMr"}
                              width={250}
                              InputLabelProps={{
                                shrink: watch("ofName") ? true : false,
                              }}
                              label={<FormattedLabel id="firstName" required />}
                              error={!!errors.ofName}
                              helperText={
                                errors?.ofName ? errors.ofName.message : null
                              }
                            />
                          </div>

                          <div>
                            {/* <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            //  disabled
                            disabled={disable}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            // label="Middle Name *"
                            label={<FormattedLabel id="middleName" required />}
                            variant="standard"
                            {...register("omName")}
                            error={!!errors.omName}
                            helperText={
                              errors?.omName ? errors.omName.message : null
                            }
                          /> */}

                            <Transliteration
                              disabled={disableOwner}
                              _key={"omName"}
                              labelName={"middleName"}
                              fieldName={"omName"}
                              updateFieldName={"omNameMr"}
                              sourceLang={"eng"}
                              targetLang={"mar"}
                              targetError={"omNameMr"}
                              width={250}
                              label={
                                <FormattedLabel id="middleName" required />
                              }
                              error={!!errors.omName}
                              helperText={
                                errors?.omName ? errors.omName.message : null
                              }
                            />
                          </div>
                          <div>
                            {/* <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            // disabled
                            disabled={disable}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            // label="Last Name *"
                            label={<FormattedLabel id="lastName" required />}
                            variant="standard"
                            {...register("olName")}
                            error={!!errors.olName}
                            helperText={
                              errors?.olName ? errors.olName.message : null
                            }
                          /> */}
                            <Transliteration
                              disabled={disableOwner}
                              _key={"olName"}
                              labelName={"lastName"}
                              fieldName={"olName"}
                              updateFieldName={"olNameMr"}
                              sourceLang={"eng"}
                              targetLang={"mar"}
                              targetError={"olNameMr"}
                              width={250}
                              label={<FormattedLabel id="lastName" required />}
                              error={!!errors.olName}
                              helperText={
                                errors?.olName ? errors.olName.message : null
                              }
                            />
                          </div>
                        </div>
                        <div className={styles.row}>
                          {/* <div style={{ marginTop: "3vh" }}>
                          <FormControl
                            variant="standard"
                            error={!!errors.otitlemr}
                            sx={{ width: "250px" }}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="titlemr" required />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  // disabled
                                  disabled={disable}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Title  "
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
                              name="otitlemr"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.otitlemr
                                ? errors.otitlemr.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </div> */}

                          <div style={{ marginTop: "3vh" }}>
                            {/* <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            //  disabled
                            disabled={disable}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            // label="प्रथम नावं *"
                            label={<FormattedLabel id="firstNamemr" required />}
                            // label=" Hello"
                            variant="standard"
                            {...register("ofNameMr")}
                            error={!!errors.ofNameMr}
                            helperText={
                              errors?.ofNameMr ? errors.ofNameMr.message : null
                            }
                          /> */}
                            <Transliteration
                              disabled={disableOwner}
                              _key={"ofNameMr"}
                              labelName={"firstNamemr"}
                              fieldName={"ofNameMr"}
                              updateFieldName={"ofName"}
                              sourceLang={"mar"}
                              targetLang={"eng"}
                              targetError={"ofName"}
                              width={250}
                              label={
                                <FormattedLabel id="firstNamemr" required />
                              }
                              error={!!errors.ofNameMr}
                              helperText={
                                errors?.ofNameMr
                                  ? errors.ofNameMr.message
                                  : null
                              }
                            />
                          </div>

                          <div style={{ marginTop: "3vh" }}>
                            {/* <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            //  disabled
                            disabled={disable}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            //label="Middle Name *"
                            label={
                              <FormattedLabel id="middleNamemr" required />
                            }
                            // label="मधले नावं *"
                            variant="standard"
                            {...register("omNameMr")}
                            error={!!errors.omNameMr}
                            helperText={
                              errors?.omNameMr ? errors.omNameMr.message : null
                            }
                          /> */}

                            <Transliteration
                              disabled={disableOwner}
                              _key={"omNameMr"}
                              labelName={"middleNamemr"}
                              fieldName={"omNameMr"}
                              updateFieldName={"omName"}
                              sourceLang={"mar"}
                              targetLang={"eng"}
                              targetError={"omName"}
                              width={250}
                              label={
                                <FormattedLabel id="middleNamemr" required />
                              }
                              error={!!errors.omNameMr}
                              helperText={
                                errors?.omNameMr
                                  ? errors.omNameMr.message
                                  : null
                              }
                            />
                          </div>
                          <div style={{ marginTop: "3vh" }}>
                            {/* <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            // disabled
                            disabled={disable}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            //label="Last Name *"
                            label={<FormattedLabel id="lastNamemr" required />}
                            // label="आडनाव *"
                            variant="standard"
                            {...register("olNameMr")}
                            error={!!errors.olNameMr}
                            helperText={
                              errors?.olNameMr ? errors.olNameMr.message : null
                            }
                          /> */}

                            <Transliteration
                              disabled={disableOwner}
                              _key={"olNameMr"}
                              labelName={"lastNamemr"}
                              fieldName={"olNameMr"}
                              updateFieldName={"olName"}
                              sourceLang={"mar"}
                              targetLang={"eng"}
                              targetError={"olName"}
                              width={250}
                              label={
                                <FormattedLabel id="lastNamemr" required />
                              }
                              error={!!errors.olNameMr}
                              helperText={
                                errors?.olNameMr
                                  ? errors.olNameMr.message
                                  : null
                              }
                            />
                          </div>
                        </div>

                        <div className={styles.details}>
                          <div className={styles.h1Tag}>
                            <h3
                              style={{
                                color: "white",
                                marginTop: "7px",
                              }}
                            >
                              {<FormattedLabel id="Owneraddress" />}
                              {/* Owner Address: */}
                            </h3>
                          </div>
                        </div>

                        <div className={styles.row}>
                          <div>
                            <TextField
                              InputLabelProps={{
                                shrink: watch("oflatBuildingNo") ? true : false,
                              }}
                              //  disabled
                              disabled={disableOwner}
                              sx={{ width: 250 }}
                              id="standard-basic"
                              label={<FormattedLabel id="flatBuildingNo" />}
                              variant="standard"
                              //  value={`${this.state.pflatBuildingNo},${this.state.cflatBuildingNo}`}
                              //  value={pflatBuildingNo}
                              // onChange={(e) => setValue(e.target.pflatBuildingNo)}
                              {...register("oflatBuildingNo")}
                              error={!!errors.oflatBuildingNo}
                              helperText={
                                errors?.oflatBuildingNo
                                  ? errors.oflatBuildingNo.message
                                  : null
                              }
                            />
                          </div>

                          <div style={{ marginTop: "3vh" }}>
                            {/* <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            //  disabled
                            disabled={disable}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={
                              <FormattedLabel id="buildingName" required />
                            }
                            variant="standard"
                            {...register("obuildingName")}
                            error={!!errors.obuildingName}
                            helperText={
                              errors?.obuildingName
                                ? errors.obuildingName.message
                                : null
                            }
                          /> */}

                            <Transliteration
                              disabled={disableOwner}
                              _key={"obuildingName"}
                              labelName={"buildingName"}
                              fieldName={"obuildingName"}
                              updateFieldName={"obuildingNameMr"}
                              sourceLang={"eng"}
                              targetLang={"mar"}
                              targetError={"obuildingNameMr"}
                              width={250}
                              label={<FormattedLabel id="buildingName" />}
                              error={!!errors.obuildingName}
                              helperText={
                                errors?.obuildingName
                                  ? errors.obuildingName.message
                                  : null
                              }
                            />
                          </div>

                          <div style={{ marginTop: "3vh" }}>
                            {/* <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            //  disabled
                            disabled={disable}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="roadName" required />}
                            variant="standard"
                            {...register("oroadName")}
                            error={!!errors.oroadName}
                            helperText={
                              errors?.oroadName
                                ? errors.oroadName.message
                                : null
                            }
                          /> */}
                            <Transliteration
                              disabled={disableOwner}
                              _key={"oroadName"}
                              labelName={"roadName"}
                              fieldName={"oroadName"}
                              updateFieldName={"oroadNameMr"}
                              sourceLang={"eng"}
                              targetLang={"mar"}
                              targetError={"oroadNameMr"}
                              width={250}
                              label={<FormattedLabel id="roadName" required />}
                              error={!!errors.oroadName}
                              helperText={
                                errors?.oroadName
                                  ? errors.oroadName.message
                                  : null
                              }
                            />
                          </div>
                        </div>
                        <div className={styles.row3}>
                          <div style={{ marginTop: "3vh" }}>
                            {/* <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            //  disabled
                            disabled={disable}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="Landmark" required />}
                            variant="standard"
                            {...register("olandmark")}
                            error={!!errors.olandmark}
                            helperText={
                              errors?.olandmark
                                ? errors.olandmark.message
                                : null
                            }
                          /> */}

                            <Transliteration
                              disabled={disableOwner}
                              _key={"olandmark"}
                              labelName={"Landmark"}
                              fieldName={"olandmark"}
                              updateFieldName={"olandmarkMr"}
                              sourceLang={"eng"}
                              targetLang={"mar"}
                              width={250}
                              targetError={"olandmarkMr"}
                              label={<FormattedLabel id="Landmark" required />}
                              error={!!errors.olandmark}
                              helperText={
                                errors?.olandmark
                                  ? errors.olandmark.message
                                  : null
                              }
                            />
                          </div>

                          <div style={{ marginTop: "3vh" }}>
                            {/* <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            //  disabled
                            disabled={disable}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="cityName" required />}
                            variant="standard"
                            {...register("ocityName")}
                            error={!!errors.ocityName}
                            helperText={
                              errors?.ocityName
                                ? errors.ocityName.message
                                : null
                            }
                          /> */}

                            <Transliteration
                              disabled={disableOwner}
                              _key={"ocityName"}
                              labelName={"cityName"}
                              fieldName={"ocityName"}
                              updateFieldName={"ocityNameMr"}
                              sourceLang={"eng"}
                              targetLang={"mar"}
                              targetError={"ocityNameMr"}
                              width={250}
                              label={<FormattedLabel id="cityName" required />}
                              error={!!errors.ocityName}
                              helperText={
                                errors?.ocityName
                                  ? errors.ocityName.message
                                  : null
                              }
                            />
                          </div>

                          <div>
                            <TextField
                              InputLabelProps={{
                                shrink: true,
                              }}
                              defaultValue="Maharashtra"
                              disabled={disableOwner}
                              // disabled
                              sx={{ width: 250 }}
                              id="standard-basic"
                              label={<FormattedLabel id="State" required />}
                              variant="standard"
                              {...register("ostate")}
                              error={!!errors.ostate}
                              helperText={
                                errors?.ostate ? errors.ostate.message : null
                              }
                            />
                            {/* <Transliteration
                            _key={"ostate"}
                            labelName={"State"}
                            fieldName={"ostate"}
                            updateFieldName={"ostateMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            width={250}
                            label={<FormattedLabel id="State" required />}
                            error={!!errors.ostate}
                            helperText={
                              errors?.ostate ? errors.ostate.message : null
                            }
                          /> */}
                          </div>
                        </div>

                        {/* marathi Adress */}

                        <div className={styles.row}>
                          <div>
                            <TextField
                              InputLabelProps={{
                                shrink: watch("oflatBuildingNo") ? true : false,
                              }}
                              //  disabled
                              disabled={disableOwner}
                              sx={{ width: 250 }}
                              id="standard-basic"
                              label={<FormattedLabel id="flatBuildingNomr" />}
                              // label="फ्लॅट नंबर"
                              variant="standard"
                              //  value={`${this.state.pflatBuildingNo},${this.state.cflatBuildingNo}`}
                              value={watch("oflatBuildingNo")}
                              // onChange={(e) => setValue(e.target.pflatBuildingNo)}
                              {...register("oflatBuildingNoMr")}
                              error={!!errors.oflatBuildingNoMr}
                              helperText={
                                errors?.oflatBuildingNoMr
                                  ? errors.oflatBuildingNoMr.message
                                  : null
                              }
                            />
                          </div>

                          <div style={{ marginTop: "3vh" }}>
                            {/* <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            //  disabled
                            disabled={disable}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={
                              <FormattedLabel id="buildingNamemr" required />
                            }
                            // label="अपार्टमेंट नाव"
                            variant="standard"
                            {...register("obuildingNameMr")}
                            error={!!errors.obuildingNameMr}
                            helperText={
                              errors?.obuildingNameMr
                                ? errors.obuildingNameMr.message
                                : null
                            }
                          /> */}

                            <Transliteration
                              disabled={disableOwner}
                              _key={"obuildingNameMr"}
                              labelName={"buildingNamemr"}
                              fieldName={"obuildingNameMr"}
                              updateFieldName={"obuildingName"}
                              sourceLang={"mar"}
                              targetLang={"eng"}
                              width={250}
                              targetError={"obuildingName"}
                              label={<FormattedLabel id="buildingNamemr" />}
                              error={!!errors.obuildingNameMr}
                              helperText={
                                errors?.obuildingNameMr
                                  ? errors.obuildingNameMr.message
                                  : null
                              }
                            />
                          </div>

                          <div style={{ marginTop: "3vh" }}>
                            {/* <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            //  disabled
                            disabled={disable}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="roadNamemr" required />}
                            // label="गल्लीचे नाव"
                            variant="standard"
                            {...register("oroadNameMr")}
                            error={!!errors.oroadNameMr}
                            helperText={
                              errors?.oroadNameMr
                                ? errors.oroadNameMr.message
                                : null
                            }
                          /> */}

                            <Transliteration
                              disabled={disableOwner}
                              _key={"oroadNameMr"}
                              labelName={"roadNamemr"}
                              fieldName={"oroadNameMr"}
                              updateFieldName={"oroadName"}
                              sourceLang={"mar"}
                              targetLang={"eng"}
                              targetError={"oroadName"}
                              width={250}
                              label={
                                <FormattedLabel id="roadNamemr" required />
                              }
                              error={!!errors.oroadNameMr}
                              helperText={
                                errors?.oroadNameMr
                                  ? errors.oroadNameMr.message
                                  : null
                              }
                            />
                          </div>
                        </div>
                        <div className={styles.row3}>
                          <div style={{ marginTop: "3vh" }}>
                            {/* <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            //  disabled
                            disabled={disable}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="Landmarkmr" required />}
                            // label="जमीन चिन्ह"
                            variant="standard"
                            {...register("olandmarkMr")}
                            error={!!errors.olandmarkMr}
                            helperText={
                              errors?.olandmarkMr
                                ? errors.olandmarkMr.message
                                : null
                            }
                          /> */}

                            <Transliteration
                              disabled={disableOwner}
                              _key={"olandmarkMr"}
                              labelName={"Landmarkmr"}
                              fieldName={"olandmarkMr"}
                              updateFieldName={"olandmark"}
                              sourceLang={"mar"}
                              targetLang={"eng"}
                              targetError={"olandmark"}
                              width={250}
                              label={
                                <FormattedLabel id="Landmarkmr" required />
                              }
                              error={!!errors.olandmarkMr}
                              helperText={
                                errors?.olandmarkMr
                                  ? errors.olandmarkMr.message
                                  : null
                              }
                            />
                          </div>

                          <div style={{ marginTop: "3vh" }}>
                            {/* <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            //  disabled
                            disabled={disable}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="cityNamemr" required />}
                            // label="शहराचे नाव"
                            variant="standard"
                            {...register("ocityNameMr")}
                            error={!!errors.ocityNameMr}
                            helperText={
                              errors?.ocityNameMr
                                ? errors.ocityNameMr.message
                                : null
                            }
                          /> */}

                            <Transliteration
                              disabled={disableOwner}
                              _key={"ocityNameMr"}
                              labelName={"cityNamemr"}
                              fieldName={"ocityNameMr"}
                              updateFieldName={"ocityName"}
                              sourceLang={"mar"}
                              targetLang={"eng"}
                              targetError={"ocityName"}
                              width={250}
                              label={
                                <FormattedLabel id="cityNamemr" required />
                              }
                              error={!!errors.ocityNameMr}
                              helperText={
                                errors?.ocityNameMr
                                  ? errors.ocityNameMr.message
                                  : null
                              }
                            />
                          </div>

                          <div>
                            <TextField
                              disabled={disableOwner}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              // disabled
                              defaultValue="महाराष्ट्र"
                              sx={{ width: 250 }}
                              id="standard-basic"
                              label={<FormattedLabel id="statemr" required />}
                              variant="standard"
                              {...register("ostateMr")}
                              error={!!errors.ostateMr}
                              helperText={
                                errors?.ostateMr
                                  ? errors.ostateMr.message
                                  : null
                              }
                            />

                            {/* <Transliteration
                            _key={"ostateMr"}
                            labelName={"statemr"}
                            fieldName={"ostateMr"}
                            updateFieldName={"ostate"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            width={250}
                            label={<FormattedLabel id="statemr" required />}
                            error={!!errors.ostateMr}
                            helperText={
                              errors?.ostateMr ? errors.ostateMr.message : null
                            } */}
                            {/* /> */}
                          </div>
                        </div>
                        <div className={styles.row}>
                          <div>
                            <TextField
                              InputLabelProps={{
                                shrink: watch("opincode") ? true : false,
                              }}
                              //  disabled
                              disabled={disableOwner}
                              sx={{ width: 250 }}
                              id="standard-basic"
                              label={<FormattedLabel id="pincode" required />}
                              variant="standard"
                              {...register("opincode")}
                              error={!!errors.opincode}
                              inputProps={{ maxLength: 6 }}
                              helperText={
                                errors?.opincode
                                  ? errors.opincode.message
                                  : null
                              }
                            />
                          </div>
                          <div>
                            <TextField
                              InputLabelProps={{
                                shrink: watch("omobileNo") ? true : false,
                              }}
                              disabled={disableOwner}
                              sx={{ width: 250 }}
                              id="standard-basic"
                              inputProps={{ maxLength: 10 }}
                              label={<FormattedLabel id="mobileNo" required />}
                              variant="standard"
                              // value={pageType ? router.query.mobile : ''}
                              // disabled={router.query.pageMode === 'View'}
                              {...register("omobileNo")}
                              error={!!errors.omobileNo}
                              helperText={
                                errors?.omobileNo
                                  ? errors.omobileNo.message
                                  : null
                              }
                            />
                          </div>

                          <div>
                            <TextField
                              InputLabelProps={{
                                shrink: watch("oemail") ? true : false,
                              }}
                              disabled={disableOwner}
                              sx={{ width: 250 }}
                              id="standard-basic"
                              label={<FormattedLabel id="email" required />}
                              variant="standard"
                              //  value={pageType ? router.query.emailAddress : ''}
                              // disabled={router.query.pageMode === 'View'}
                              {...register("oemail")}
                              error={!!errors.oemail}
                              helperText={
                                errors?.oemail ? errors.oemail.message : null
                              }
                            />
                          </div>
                        </div>
                        {/* </Paper> */}
                        <div className={styles.details}>
                          <div className={styles.h1Tag}>
                            <h3
                              style={{
                                color: "white",
                                marginTop: "7px",
                              }}
                            >
                              {<FormattedLabel id="boardDetail" />}
                            </h3>
                          </div>
                        </div>

                        <div className={styles.row2}>
                          <div style={{ marginTop: "3vh" }}>
                            {/* <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            disabled={disable}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="boardName" required />}
                            variant="standard"
                            // disabled={router.query.pageMode === 'View'}
                            {...register("marriageBoardName")}
                            error={!!errors.marriageBoardName}
                            helperText={
                              errors?.marriageBoardName
                                ? errors.marriageBoardName.message
                                : null
                            }
                          /> */}

                            <Transliteration
                              disabled={disable}
                              InputLabelProps={{
                                shrink: watch("marriageBoardName")
                                  ? true
                                  : false,
                              }}
                              _key={"marriageBoardName"}
                              labelName={"boardName"}
                              fieldName={"marriageBoardName"}
                              updateFieldName={"marriageBoardNameMr"}
                              sourceLang={"eng"}
                              targetLang={"mar"}
                              width={250}
                              targetError={"marriageBoardNameMr"}
                              label={<FormattedLabel id="boardName" required />}
                              error={!!errors.marriageBoardName}
                              helperText={
                                errors?.marriageBoardName
                                  ? errors.marriageBoardName.message
                                  : null
                              }
                            />
                          </div>
                          <div style={{ marginTop: "3vh" }}>
                            <Transliteration
                              disabled={disable}
                              InputLabelProps={{
                                shrink: watch("marriageBoardNameMr")
                                  ? true
                                  : false,
                              }}
                              _key={"marriageBoardNameMr"}
                              labelName={"boardNamemr"}
                              fieldName={"marriageBoardNameMr"}
                              updateFieldName={"marriageBoardName"}
                              sourceLang={"mar"}
                              targetLang={"eng"}
                              targetError={"marriageBoardName"}
                              width={250}
                              label={
                                <FormattedLabel id="boardNamemr" required />
                              }
                              error={!!errors.marriageBoardNameMr}
                              helperText={
                                errors?.marriageBoardNameMr
                                  ? errors.marriageBoardNameMr.message
                                  : null
                              }
                            />
                            {/* <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            disabled={disable}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="boardNamemr" required />}
                            // label="विवाह मंडळचे नाव "
                            variant="standard"
                            // value={pageType ? router.query.marriageBoardName : ''}
                            // disabled={router.query.pageMode === 'View'}
                            {...register("marriageBoardNameMr")}
                            error={!!errors.marriageBoardNameMr}
                            helperText={
                              errors?.marriageBoardNameMr
                                ? errors.marriageBoardNameMr.message
                                : null
                            }
                          /> */}
                          </div>
                        </div>

                        <div className={styles.row}>
                          <div>
                            <TextField
                              InputLabelProps={{
                                shrink: watch("bflatBuildingNo") ? true : false,
                              }}
                              disabled={disable}
                              sx={{ width: 250 }}
                              id="standard-basic"
                              label={<FormattedLabel id="flatBuildingNo" />}
                              variant="standard"
                              //value={pageType ? router.query.flatBuildingNo : ''}
                              // disabled={router.query.pageMode === 'View'}
                              {...register("bflatBuildingNo")}
                              error={!!errors.bflatBuildingNo}
                              helperText={
                                errors?.bflatBuildingNo
                                  ? errors.bflatBuildingNo.message
                                  : null
                              }
                            />
                          </div>

                          <div style={{ marginTop: "3vh" }}>
                            {/* <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            disabled={disable}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={
                              <FormattedLabel id="buildingName" required />
                            }
                            variant="standard"
                            // value={pageType ? router.query.buildingName : ''}
                            // disabled={router.query.pageMode === 'View'}
                            {...register("bbuildingName")}
                            error={!!errors.bbuildingName}
                            helperText={
                              errors?.bbuildingName
                                ? errors.bbuildingName.message
                                : null
                            }
                          /> */}

                            <Transliteration
                              disabled={disable}
                              // InputLabelProps={{
                              //   shrink: true,
                              // }}
                              _key={"bbuildingName"}
                              labelName={"buildingName"}
                              fieldName={"bbuildingName"}
                              updateFieldName={"bbuildingNameMr"}
                              sourceLang={"eng"}
                              targetLang={"mar"}
                              targetError={"bbuildingNameMr"}
                              width={250}
                              label={<FormattedLabel id="buildingName" />}
                              error={!!errors.bbuildingName}
                              helperText={
                                errors?.bbuildingName
                                  ? errors.bbuildingName.message
                                  : null
                              }
                            />
                          </div>

                          <div style={{ marginTop: "3vh" }}>
                            {/* <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            disabled={disable}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="roadName" required />}
                            variant="standard"
                            // value={pageType ? router.query.roadName : ''}
                            {...register("broadName")}
                            error={!!errors.broadName}
                            helperText={
                              errors?.broadName
                                ? errors.broadName.message
                                : null
                            }
                          /> */}
                            <Transliteration
                              disabled={disable}
                              // InputLabelProps={{
                              //   shrink: true,
                              // }}
                              _key={"broadName"}
                              labelName={"roadName"}
                              fieldName={"broadName"}
                              updateFieldName={"broadNameMr"}
                              sourceLang={"eng"}
                              targetLang={"mar"}
                              targetError={"broadNameMr"}
                              width={250}
                              label={<FormattedLabel id="roadName" required />}
                              error={!!errors.broadName}
                              helperText={
                                errors?.broadName
                                  ? errors.broadName.message
                                  : null
                              }
                            />
                          </div>
                        </div>

                        <div className={styles.row}>
                          <div style={{ marginTop: "3vh" }}>
                            {/* <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="Landmark" required />}
                            variant="standard"
                            // value={pageType ? router.query.landmark : ''}
                            disabled={disable}
                            {...register("blandmark")}
                            error={!!errors.blandmark}
                            helperText={
                              errors?.blandmark
                                ? errors.blandmark.message
                                : null
                            }
                          /> */}
                            <Transliteration
                              disabled={disable}
                              // InputLabelProps={{
                              //   shrink: true,
                              // }}
                              _key={"blandmark"}
                              labelName={"Landmark"}
                              fieldName={"blandmark"}
                              updateFieldName={"blandmarkMr"}
                              sourceLang={"eng"}
                              targetLang={"mar"}
                              targetError={"blandmarkMr"}
                              width={250}
                              label={<FormattedLabel id="Landmark" required />}
                              error={!!errors.blandmark}
                              helperText={
                                errors?.blandmark
                                  ? errors.blandmark.message
                                  : null
                              }
                            />
                          </div>

                          <div style={{ marginTop: "3vh" }}>
                            {/* <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="cityName" required />}
                            variant="standard"
                            //   value={pageType ? router.query.city : ''}
                            disabled={disable}
                            {...register("city")}
                            error={!!errors.city}
                            helperText={
                              errors?.city ? errors.city.message : null
                            }
                          /> */}
                            <Transliteration
                              disabled={disable}
                              // InputLabelProps={{
                              //   shrink: true,
                              // }}
                              _key={"city"}
                              labelName={"cityName"}
                              fieldName={"city"}
                              updateFieldName={"cityMr"}
                              sourceLang={"eng"}
                              targetLang={"mar"}
                              width={250}
                              targetError={"cityMr"}
                              label={<FormattedLabel id="cityName" required />}
                              error={!!errors.city}
                              helperText={
                                errors?.city ? errors.city.message : null
                              }
                            />
                          </div>

                          <div>
                            <TextField
                              InputLabelProps={{
                                shrink: watch("bpincode") ? true : false,
                              }}
                              sx={{ width: 250 }}
                              id="standard-basic"
                              label={<FormattedLabel id="pincode" required />}
                              variant="standard"
                              inputProps={{ maxLength: 6 }}
                              //  value={pageType ? router.query.pincode : ''}
                              disabled={disable}
                              {...register("bpincode")}
                              error={!!errors.bpincode}
                              helperText={
                                errors?.bpincode
                                  ? errors.bpincode.message
                                  : null
                              }
                            />
                          </div>
                        </div>

                        <div className={styles.row}>
                          <div>
                            <TextField
                              InputLabelProps={{
                                shrink: watch("bflatBuildingNoMr")
                                  ? true
                                  : false,
                              }}
                              sx={{ width: 250 }}
                              id="standard-basic"
                              label={<FormattedLabel id="flatBuildingNomr" />}
                              // label="फ्लॅट नंबर"
                              variant="standard"
                              // value={watch("bflatBuildingNo")}
                              disabled={disable}
                              {...register("bflatBuildingNoMr")}
                              error={!!errors.bflatBuildingNoMr}
                              helperText={
                                errors?.bflatBuildingNoMr
                                  ? errors.bflatBuildingNoMr.message
                                  : null
                              }
                            />
                          </div>

                          <div style={{ marginTop: "3vh" }}>
                            {/* <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={
                              <FormattedLabel id="buildingNamemr" required />
                            }
                            // label="अपार्टमेंट नाव"
                            variant="standard"
                            // value={pageType ? router.query.buildingName : ''}
                            disabled={disable}
                            {...register("bbuildingNameMr")}
                            error={!!errors.bbuildingNameMr}
                            helperText={
                              errors?.bbuildingNameMr
                                ? errors.bbuildingNameMr.message
                                : null
                            }
                          /> */}

                            <Transliteration
                              disabled={disable}
                              // InputLabelProps={{
                              //   shrink: true,
                              // }}
                              _key={"bbuildingNameMr"}
                              labelName={"buildingNamemr"}
                              fieldName={"bbuildingNameMr"}
                              updateFieldName={"bbuildingName"}
                              sourceLang={"mar"}
                              targetLang={"eng"}
                              targetError={"bbuildingName"}
                              width={250}
                              label={<FormattedLabel id="buildingNamemr" />}
                              error={!!errors.bbuildingNameMr}
                              helperText={
                                errors?.bbuildingNameMr
                                  ? errors.bbuildingNameMr.message
                                  : null
                              }
                            />
                          </div>

                          <div style={{ marginTop: "3vh" }}>
                            {/* <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="roadNamemr" required />}
                            // label="गल्लीचे नाव"
                            variant="standard"
                            // value={pageType ? router.query.roadName : ''}
                            disabled={disable}
                            {...register("broadNameMr")}
                            error={!!errors.broadNameMr}
                            helperText={
                              errors?.broadNameMr
                                ? errors.broadNameMr.message
                                : null
                            }
                          /> */}

                            <Transliteration
                              disabled={disable}
                              // InputLabelProps={{
                              //   shrink: true,
                              // }}
                              _key={"broadNameMr"}
                              labelName={"roadNamemr"}
                              fieldName={"broadNameMr"}
                              updateFieldName={"broadName"}
                              sourceLang={"mar"}
                              targetLang={"eng"}
                              width={250}
                              targetError={"broadName"}
                              label={
                                <FormattedLabel id="roadNamemr" required />
                              }
                              error={!!errors.broadNameMr}
                              helperText={
                                errors?.broadNameMr
                                  ? errors.broadNameMr.message
                                  : null
                              }
                            />
                          </div>
                        </div>

                        <div className={styles.row}>
                          <div style={{ marginTop: "3vh" }}>
                            {/* <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="Landmarkmr" required />}
                            // label="जमीन चिन्ह"
                            variant="standard"
                            // value={pageType ? router.query.landmark : ''}
                            disabled={disable}
                            {...register("blandmarkMr")}
                            error={!!errors.blandmarkMr}
                            helperText={
                              errors?.blandmarkMr
                                ? errors.blandmarkMr.message
                                : null
                            }
                          /> */}

                            <Transliteration
                              disabled={disable}
                              // InputLabelProps={{
                              //   shrink: true,
                              // }}
                              _key={"blandmarkMr"}
                              labelName={"Landmarkmr"}
                              fieldName={"blandmarkMr"}
                              updateFieldName={"blandmark"}
                              sourceLang={"mar"}
                              targetLang={"eng"}
                              width={250}
                              targetError={"blandmark"}
                              label={
                                <FormattedLabel id="Landmarkmr" required />
                              }
                              error={!!errors.blandmarkMr}
                              // disabled={true}
                              helperText={
                                errors?.blandmarkMr
                                  ? errors.blandmarkMr.message
                                  : null
                              }
                            />
                          </div>

                          <div style={{ marginTop: "3vh" }}>
                            {/* <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="cityNamemr" required />}
                            // label="शहराचे नाव"
                            variant="standard"
                            //   value={pageType ? router.query.city : ''}
                            disabled={disable}
                            {...register("cityMr")}
                            error={!!errors.cityMr}
                            helperText={
                              errors?.cityMr ? errors.cityMr.message : null
                            }
                          /> */}

                            <Transliteration
                              disabled={disable}
                              // InputLabelProps={{
                              //   shrink: true,
                              // }}
                              _key={"cityMr"}
                              labelName={"cityNamemr"}
                              fieldName={"cityMr"}
                              updateFieldName={"city"}
                              sourceLang={"mar"}
                              targetLang={"eng"}
                              width={250}
                              targetError={"city"}
                              label={
                                <FormattedLabel id="cityNamemr" required />
                              }
                              error={!!errors.cityMr}
                              helperText={
                                errors?.cityMr ? errors.cityMr.message : null
                              }
                            />
                          </div>

                          <div>
                            <TextField
                              InputLabelProps={{
                                shrink: watch("aadhaarNo") ? true : false,
                              }}
                              sx={{ width: 250 }}
                              id="standard-basic"
                              inputProps={{ maxLength: 12 }}
                              label={<FormattedLabel id="AadharNo" required />}
                              variant="standard"
                              // value={pageType ? router.query.aadhaarNo : ''}
                              disabled={disable}
                              {...register("aadhaarNo")}
                              error={!!errors.aadhaarNo}
                              helperText={
                                errors?.aadhaarNo
                                  ? errors.aadhaarNo.message
                                  : null
                              }
                            />
                          </div>
                        </div>

                        <div className={styles.row}>
                          <div>
                            <TextField
                              InputLabelProps={{
                                shrink: watch("bLatitude") ? true : false,
                              }}
                              sx={{ width: 250 }}
                              id="standard-basic"
                              label={<FormattedLabel id="bLatitude" />}
                              // label={"Latitude"}
                              variant="standard"
                              inputProps={{ maxLength: 10 }}
                              // value={pageType ? router.query.bLatitude  : ''}
                              disabled={disable}
                              {...register("bLatitude")}
                              error={!!errors.bLatitude}
                              helperText={
                                errors?.bLatitude
                                  ? errors.bLatitude.message
                                  : null
                              }
                            />
                          </div>

                          <div>
                            <TextField
                              InputLabelProps={{
                                shrink: watch("bLongitude") ? true : false,
                              }}
                              sx={{ width: 250 }}
                              id="standard-basic"
                              label={<FormattedLabel id="bLongitude" />}
                              // label={"Longitude"}
                              variant="standard"
                              //  value={pageType ? router.query.bLongitude  : ''}
                              disabled={disable}
                              {...register("bLongitude")}
                              error={!!errors.bLongitude}
                              helperText={
                                errors?.bLongitude
                                  ? errors.bLongitude.message
                                  : null
                              }
                            />
                          </div>
                        </div>
                        <div className={styles.row}>
                          <div>
                            <TextField
                              InputLabelProps={{
                                shrink: watch("mobile") ? true : false,
                              }}
                              sx={{ width: 250 }}
                              id="standard-basic"
                              label={<FormattedLabel id="mobileNo" required />}
                              variant="standard"
                              inputProps={{ maxLength: 10 }}
                              // value={pageType ? router.query.mobile : ''}
                              disabled={disable}
                              {...register("mobile")}
                              error={!!errors.mobile}
                              helperText={
                                errors?.mobile ? errors.mobile.message : null
                              }
                            />
                          </div>

                          <div>
                            <TextField
                              InputLabelProps={{
                                shrink: watch("emailAddress") ? true : false,
                              }}
                              sx={{ width: 250 }}
                              id="standard-basic"
                              label={<FormattedLabel id="email" required />}
                              variant="standard"
                              //  value={pageType ? router.query.emailAddress : ''}
                              disabled={disable}
                              {...register("emailAddress")}
                              error={!!errors.emailAddress}
                              helperText={
                                errors?.emailAddress
                                  ? errors.emailAddress.message
                                  : null
                              }
                            />
                          </div>
                        </div>
                      </>
                    )}
                    {/* //doc start */}
                    {!props.preview && (
                      <>
                        <div className={styles.details}>
                          <div className={styles.h1Tag}>
                            <h3
                              style={{
                                color: "white",
                                marginTop: "7px",
                              }}
                            >
                              {<FormattedLabel id="document" />} {"  "}
                            </h3>
                            <span
                              style={{
                                color: "white",
                                marginTop: "9px",
                              }}
                            >
                              {" "}
                              <b>
                                {" "}
                                <FormattedLabel id="docFormat" />:
                              </b>
                            </span>
                          </div>
                        </div>

                        <table className={styles.doctable}>
                          <tr>
                            <th className={styles.docTh}>
                              {" "}
                              <Typography>
                                {" "}
                                {language == "en"
                                  ? "Document Name"
                                  : "दस्तऐवजाचे नाव"}
                              </Typography>
                            </th>
                            <th className={styles.docTh}>
                              {" "}
                              <Typography>
                                {" "}
                                {language == "en" ? "Document" : "दस्तऐवज"}
                              </Typography>
                            </th>
                          </tr>
                          <tr>
                            {/* <td className={styles.docTd}>1</td> */}
                            <td className={styles.docTd}>
                              {" "}
                              <Typography>
                                {" "}
                                {
                                  <FormattedLabel
                                    id="boardheadphoto"
                                    required
                                  />
                                }
                              </Typography>
                            </td>
                            <td className={styles.docTd}>
                              {" "}
                              <UploadButton1
                                error={!!errors?.boardHeadPersonPhoto}
                                appName={appName}
                                serviceName={serviceName}
                                fileDtl={getValues("boardHeadPersonPhoto")}
                                fileKey={"boardHeadPersonPhoto"}
                                showDel={pageMode ? false : true}
                                fileNameEncrypted={(path) => {
                                  setEncryptedBoardHeadPersonPhoto(path)
                                  setValue("boardHeadPersonPhoto",path)
                                }}
                              />
                              <FormHelperText
                                error={!!errors?.boardHeadPersonPhoto}
                              >
                                {errors?.boardHeadPersonPhoto
                                  ? errors?.boardHeadPersonPhoto?.message
                                  : null}
                              </FormHelperText>
                            </td>
                          </tr>
                          <tr>
                            {/* <td className={styles.docTd}>2</td> */}
                            <td className={styles.docTd}>
                              {" "}
                              <Typography>
                                {
                                  <FormattedLabel
                                    id="boardorgphotocpy"
                                    required
                                  />
                                }
                              </Typography>
                            </td>
                            <td className={styles.docTd}>
                              {" "}
                              <UploadButton
                                error={!!errors?.boardOrganizationPhoto}
                                appName={appName}
                                serviceName={serviceName}
                                fileDtl={getValues("boardOrganizationPhoto")}
                                fileKey={"boardOrganizationPhoto"}
                                showDel={pageMode ? false : true}
                                fileNameEncrypted={(path) => {
                                  setEncryptedBoardOrganizationPhoto(path)
                                  setValue("boardOrganizationPhoto",path)
                                }}
                              />
                              <FormHelperText
                                error={!!errors?.boardOrganizationPhoto}
                              >
                                {errors?.boardOrganizationPhoto
                                  ? errors?.boardOrganizationPhoto?.message
                                  : null}
                              </FormHelperText>
                            </td>
                          </tr>
                          <tr>
                            {/* <td className={styles.docTd}>3</td> */}
                            <td className={styles.docTd}>
                              {" "}
                              <Typography>
                                {" "}
                                {<FormattedLabel id="panCard" required />}
                              </Typography>
                            </td>
                            <td className={styles.docTd}>
                              <UploadButton
                                error={!!errors?.panCard}
                                appName={appName}
                                serviceName={serviceName}
                                fileDtl={getValues("panCard")}
                                fileKey={"panCard"}
                                showDel={pageMode ? false : true}
                                fileNameEncrypted={(path) => {
                                  setEncryptedPanCard(path)
                                  setValue("panCard",path)
                                }}
                              />
                              <FormHelperText error={!!errors?.panCard}>
                                {errors?.panCard
                                  ? errors?.panCard?.message
                                  : null}
                              </FormHelperText>
                            </td>
                          </tr>
                          <tr>
                            {/* <td className={styles.docTd}>4</td> */}
                            <td className={styles.docTd}>
                              <Typography>
                                {" "}
                                {<FormattedLabel id="adharcard" required />}
                              </Typography>
                            </td>
                            <td className={styles.docTd}>
                              {" "}
                              <UploadButton
                                error={!!errors?.aadharCard}
                                appName={appName}
                                serviceName={serviceName}
                                fileDtl={getValues("aadharCard")}
                                fileKey={"aadharCard"}
                                showDel={pageMode ? false : true}
                                fileNameEncrypted={(path) => {
                                  setEncryptedAadharCard(path)
                                  setValue("aadharCard",path)
                                }}
                              />
                              <FormHelperText error={!!errors?.aadharCard}>
                                {errors?.aadharCard
                                  ? errors?.aadharCard?.message
                                  : null}
                              </FormHelperText>
                            </td>
                          </tr>
                          {((watch("rationCard") && router.query.pageMode !== "Add") ||
                            (localStorage.loggedInUser == "citizenUser")) && (
                                <tr>
                                  {/* <td className={styles.docTd}>5</td> */}
                                  <td className={styles.docTd}>
                                    <Typography>
                                      {" "}
                                      {<FormattedLabel id="rationcard" />}
                                    </Typography>
                                  </td>
                                  <td className={styles.docTd}>
                                    {" "}
                                    <UploadButton
                                      appName={appName}
                                      serviceName={serviceName}
                                      fileDtl={getValues("rationCard")}
                                      fileKey={"rationCard"}
                                      showDel={pageMode ? false : true}
                                      fileNameEncrypted={(path) => {
                                        setEncryptedRationCard(path)
                                        setValue("rationCard",path)
                                      }}
                                    />
                                  </td>
                                </tr>
                              )
                              }

                          {((watch("electricityBill") && router.query.pageMode !== "Add") ||
                            (localStorage.loggedInUser == "citizenUser")) && (
                                <tr>
                                  {/* <td className={styles.docTd}>6</td> */}
                                  <td className={styles.docTd}>
                                    {" "}
                                    <Typography>
                                      {<FormattedLabel id="electrbill" />}
                                    </Typography>
                                  </td>
                                  <td className={styles.docTd}>
                                    <UploadButton
                                      appName={appName}
                                      serviceName={serviceName}
                                      fileDtl={getValues("electricityBill")}
                                      fileKey={"electricityBill"}
                                      showDel={pageMode ? false : true}
                                      fileNameEncrypted={(path) => {
                                        setEncryptedElectricityBill(path)
                                        setValue("electricityBill",path)
                                      }}
                                    />
                                  </td>
                                </tr>
                              )}
                          {((watch("resolutionOfBoard") && router.query.pageMode !== "Add") ||
                            (localStorage.loggedInUser == "citizenUser")) && (
                                <tr>
                                  {/* <td className={styles.docTd}>8</td> */}
                                  <td className={styles.docTd}>
                                    <Typography>
                                      {/* {" "}
                              {<FormattedLabel id="OtherDocument" />} */}
                                      {language == "en"
                                        ? "Resolution of the Board"
                                        : "मंडळाचा ठराव"}
                                    </Typography>
                                  </td>
                                  <td className={styles.docTd}>
                                    <UploadButton
                                      appName={appName}
                                      serviceName={serviceName}
                                      fileDtl={getValues("resolutionOfBoard")}
                                      fileKey={"resolutionOfBoard"}
                                      showDel={pageMode ? false : true}
                                      fileNameEncrypted={(path) => {
                                        setEncryptedResolutionOfBoard(path)
                                        setValue("resolutionOfBoard",path)
                                      }}
                                    />
                                  </td>
                                </tr>
                              )}
                          {((watch("receiptOfPaymentOfpropertyTax") &&
                            router.query.pageMode !== "Add") ||
                            (localStorage.loggedInUser == "citizenUser"))&& (
                                <tr>
                                  {/* <td className={styles.docTd}>9</td> */}
                                  <td className={styles.docTd}>
                                    <Typography>
                                      {/* {" "}
                              {<FormattedLabel id="OtherDocument" />} */}
                                      {language == "en"
                                        ? "Receipt of payment of property tax"
                                        : " मालमत्ता कर भरल्याची पावती "}
                                    </Typography>
                                  </td>
                                  <td className={styles.docTd}>
                                    <UploadButton
                                      appName={appName}
                                      serviceName={serviceName}
                                      fileDtl={getValues(
                                        "receiptOfPaymentOfpropertyTax",
                                      )}
                                      fileKey={"receiptOfPaymentOfpropertyTax"}
                                      showDel={pageMode ? false : true}
                                      fileNameEncrypted={(path) => {
                                        setEncryptedReceiptOfPaymentOfpropertyTax(path)
                                        setValue("receiptOfPaymentOfpropertyTax",path)
                                      }}
                                    />
                                  </td>
                                </tr>
                              )}
                          {((watch("agreemenyCopyOfProperty") &&
                            router.query.pageMode !== "Add") ||
                            (localStorage.loggedInUser == "citizenUser")) && (
                                <tr>
                                  {/* <td className={styles.docTd}>10</td> */}
                                  <td className={styles.docTd}>
                                    <Typography>
                                      {/* {" "}
                              {<FormattedLabel id="OtherDocument" />} */}
                                      {language == "en"
                                        ? "Agreement copy & Extract of Property"
                                        : "कराराची प्रत आणि मालमत्तेचा उतारा "}
                                    </Typography>
                                  </td>
                                  <td className={styles.docTd}>
                                    <UploadButton
                                      appName={appName}
                                      serviceName={serviceName}
                                      fileDtl={getValues(
                                        "agreemenyCopyOfProperty",
                                      )}
                                      fileKey={"agreemenyCopyOfProperty"}
                                      showDel={pageMode ? false : true}
                                      fileNameEncrypted={(path) => {
                                        setEncryptedAgreemenyCopyOfProperty(path)
                                        setValue("agreemenyCopyOfProperty",path)
                                      }}
                                    />
                                  </td>
                                </tr>
                              )}
                          {((watch("otherDoc") &&
                            router.query.pageMode !== "Add") ||
                            (localStorage.loggedInUser == "citizenUser")) && (
                                <tr>
                                  {/* <td className={styles.docTd}>7</td> */}
                                  <td className={styles.docTd}>
                                    <Typography>
                                      {" "}
                                      {<FormattedLabel id="OtherDocument" />}
                                    </Typography>
                                  </td>
                                  <td className={styles.docTd}>
                                    <UploadButton
                                      appName={appName}
                                      serviceName={serviceName}
                                      fileDtl={getValues("otherDoc")}
                                      fileKey={"otherDoc"}
                                      showDel={pageMode ? false : true}
                                      fileNameEncrypted={(path) => {
                                        setEncryptedOtherDoc(path)
                                        setValue("otherDoc",path)
                                      }}
                                    />
                                  </td>
                                </tr>
                              )}
                        </table>
                        {/* <Grid container style={{ marginLeft: "8vh",marginTop:"7vh" }}>
                      <Grid container>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                         

                            <Typography>
                              {" "}
                              {<FormattedLabel id="boardheadphoto" required />}
                            </Typography>
                            </Grid>
                          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            
                            <UploadButton1
                              error={!!errors?.boardHeadPersonPhoto}
                              appName={appName}
                              serviceName={serviceName}
                              fileDtl={getValues("boardHeadPersonPhoto")}
                              fileKey={"boardHeadPersonPhoto"}
                              showDel={pageMode ? false : true}
                            />
                            <FormHelperText
                              error={!!errors?.boardHeadPersonPhoto}
                            >
                              {errors?.boardHeadPersonPhoto
                                ? errors?.boardHeadPersonPhoto?.message
                                : null}
                            </FormHelperText>
                         
                        </Grid>
                        </Grid>
                        <Grid container>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                          
                            <Typography>
                              {
                                <FormattedLabel
                                  id="boardorgphotocpy"
                                  required
                                />
                              }
                            </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            <UploadButton
                              error={!!errors?.boardOrganizationPhoto}
                              appName={appName}
                              serviceName={serviceName}
                              fileDtl={getValues("boardOrganizationPhoto")}
                              fileKey={"boardOrganizationPhoto"}
                              showDel={pageMode ? false : true}

                       
                            />
                            <FormHelperText
                              error={!!errors?.boardOrganizationPhoto}
                            >
                              {errors?.boardOrganizationPhoto
                                ? errors?.boardOrganizationPhoto?.message
                                : null}
                            </FormHelperText>
                 
                        </Grid>
                        </Grid>
                        <Grid container>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                         
                            <Typography>
                              {" "}
                              {<FormattedLabel id="panCard" required />}
                            </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            <UploadButton
                              error={!!errors?.panCard}
                              appName={appName}
                              serviceName={serviceName}
                              fileDtl={getValues("panCard")}
                              fileKey={"panCard"}
                              showDel={pageMode ? false : true}

                            
                            />
                            <FormHelperText error={!!errors?.panCard}>
                              {errors?.panCard
                                ? errors?.panCard?.message
                                : null}
                            </FormHelperText>
                        
                        </Grid>
                        </Grid>
                        <Grid container>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                         
                            <Typography>
                              {" "}
                              {<FormattedLabel id="adharcard" required />}
                            </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            <UploadButton
                              error={!!errors?.aadharCard}
                              appName={appName}
                              serviceName={serviceName}
                              fileDtl={getValues("aadharCard")}
                              fileKey={"aadharCard"}
                              showDel={pageMode ? false : true}

                             
                            />
                            <FormHelperText error={!!errors?.aadharCard}>
                              {errors?.aadharCard
                                ? errors?.aadharCard?.message
                                : null}
                            </FormHelperText>
                         
                        </Grid>
                        </Grid>
                        <Grid container>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                         
                            <Typography>
                              {" "}
                              {<FormattedLabel id="rationcard" />}
                            </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            <UploadButton
                              appName={appName}
                              serviceName={serviceName}
                              fileDtl={getValues("rationCard")}
                              fileKey={"rationCard"}
                              showDel={pageMode ? false : true}

                        
                            />
                    
                        </Grid>
                        </Grid>
                        <Grid container>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                       
                            <Typography>
                              {<FormattedLabel id="electrbill" />}
                            </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            <UploadButton
                              appName={appName}
                              serviceName={serviceName}
                              fileDtl={getValues("electricityBill")}
                              fileKey={"electricityBill"}
                              showDel={pageMode ? false : true}

                            />
                          
                        </Grid>
                        </Grid>
                        <Grid container>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                        
                            <Typography>
                              {" "}
                              {<FormattedLabel id="OtherDocument" />}
                            </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            <UploadButton
                              appName={appName}
                              serviceName={serviceName}
                              fileDtl={getValues("otherDoc")}
                              fileKey={"otherDoc"}
                              showDel={pageMode ? false : true}
                            />
                         
                          </Grid>
                        </Grid>
                      </Grid> */}
                      </>
                    )}

                    {!props.preview && !props.onlyDoc && (
                      <>
                        <div className={styles.btn}>
                          {router.query.pageMode != "Check" && (
                            <>
                              <div className={styles.btn1}>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  endIcon={<SaveIcon />}
                                  onClick={formPreviewDailogOpen}
                                >
                                  {language == "en" ? "preview" : "पूर्वावलोकन"}
                                </Button>{" "}
                              </div>

                              <div className={styles.btn1}>
                                <Button
                                  type="submit"
                                  variant="contained"
                                  color="success"
                                  endIcon={<SaveIcon />}
                                  // onClick={()=>{setLoader(true)}}
                                >
                                  {<FormattedLabel id="save" />}
                                </Button>{" "}
                              </div>
                            </>
                          )}
                          {/* <div className={styles.btn1}>
                          <Button
                            variant="contained"
                            color="primary"
                            endIcon={<ClearIcon />}
                            onClick={() => cancellButton()}
                          >
                            {<FormattedLabel id="clear" />}
                          </Button>
                        </div> */}
                          <div className={styles.btn1}>
                            <Button
                              variant="contained"
                              color="error"
                              endIcon={<ExitToAppIcon />}
                              // onClick={() => exitButton()}
                              onClick={() => {
                                const textAlert =
                                  language == "en"
                                    ? "Are you sure you want to exit this Record ? "
                                    : "तुम्हाला खात्री आहे की तुम्ही या रेकॉर्डमधून बाहेर पडू इच्छिता?";
                                const title =
                                  language == "en" ? "Exit ! " : "बाहेर पडा!";
                                swal({
                                  title: title,
                                  text: textAlert,
                                  icon: "warning",
                                  buttons: true,
                                  dangerMode: true,
                                }).then((willDelete) => {
                                  if (willDelete) {
                                    language == "en"
                                      ? sweetAlert({
                                          title: "Exit!",
                                          text: "Record is Successfully Exit!!",
                                          icon: "success",
                                          button: "Ok",
                                        })
                                      : sweetAlert({
                                          title: "बाहेर पडा!",
                                          text: "रेकॉर्ड यशस्वीरित्या बाहेर पडा!",
                                          icon: "success",
                                          button: "Ok",
                                        });
                                    router.push(`/dashboard`);
                                  } else {
                                    language == "en"
                                      ? sweetAlert({
                                          title: "Cancel!",
                                          text: "Record is Successfully Cancel!!",
                                          icon: "success",
                                          button: "Ok",
                                        })
                                      : sweetAlert({
                                          title: "रद्द केले!",
                                          text: "रेकॉर्ड यशस्वीरित्या रद्द केले!",
                                          icon: "success",
                                          button: "ओके",
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
                              Preview
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
                              <FormProvider {...methods}>
                                {" "}
                                <form>
                                  <Preview preview={true} />
                                </form>
                              </FormProvider>
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
                              onClick={() => {
                                const textAlert =
                                  language == "en"
                                    ? "Are you sure you want to exit this Record ? "
                                    : "तुम्हाला खात्री आहे की तुम्ही या रेकॉर्डमधून बाहेर पडू इच्छिता?";
                                const title =
                                  language == "en" ? "Exit ! " : "बाहेर पडा!";
                                swal({
                                  title: title,
                                  text: textAlert,
                                  icon: "warning",
                                  buttons: true,
                                  dangerMode: true,
                                }).then((willDelete) => {
                                  if (willDelete) {
                                    language == "en"
                                      ? sweetAlert({
                                          title: "Exit!",
                                          text: "Record is Successfully Exit!!",
                                          icon: "success",
                                          button: "Ok",
                                        })
                                      : sweetAlert({
                                          title: "बाहेर पडा!",
                                          text: "रेकॉर्ड यशस्वीरित्या बाहेर पडा!",
                                          icon: "success",
                                          button: "Ok",
                                        });
                                    localStorage.loggedInUser ==
                                    "departmentUser"
                                      ? router.push(
                                          "/marriageRegistration/transactions/boardRegistrations/scrutiny",
                                        )
                                      : formPreviewDailogClose();
                                    //   swal("Record is Successfully Exit!", {
                                    //     icon: "success",
                                    //   });
                                    //   handleExit();
                                  } else {
                                    language == "en"
                                      ? sweetAlert({
                                          title: "Cancel!",
                                          text: "Record is Successfully Cancel!!",
                                          icon: "success",
                                          button: "Ok",
                                        })
                                      : sweetAlert({
                                          title: "रद्द केले!",
                                          text: "रेकॉर्ड यशस्वीरित्या रद्द केले!",
                                          icon: "success",
                                          button: "ओके",
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
                  </div>
                </form>
              </FormProvider>
            </div>
          </Paper>
        </ThemeProvider>
      )}
    </>
  );
};

export default Index;
