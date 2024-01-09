import React, { useState, useEffect } from "react";
import Head from "next/head";
import router from "next/router";
import styles from "../opd.module.css";

import {
  Paper,
  Button,
  MenuItem,
  Select,
  InputLabel,
  TextareaAutosize,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slide,
  InputAdornment,
} from "@mui/material";
import {
  Clear,
  Description,
  ExitToApp,
  Payment,
  Save,
  Search,
} from "@mui/icons-material";
import FormControl from "@mui/material/FormControl";
import { Controller, useForm, FormProvider } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import axios from "axios";
import URLs from "../../../../../URLS/urls";
import sweetAlert from "sweetalert";
import { sortByAsc } from "../../../../../containers/reuseableComponents/Sorter";
import UploadButton from "../../../../../containers/reuseableComponents/UploadButton";
import Slider from "../../../../../containers/reuseableComponents/Slider";
import PetCard from "../../../../../containers/VMS_ReusableComponents/PetCard";
import { DataGrid } from "@mui/x-data-grid";
import Breadcrumb from "../../../../../components/common/BreadcrumbComponent";
import Title from "../../../../../containers/VMS_ReusableComponents/Title";
import Loader from "../../../../../containers/Layout/components/Loader";
import Transliteration from "../../../../../components/common/linguosol/transliteration";
import { useGetToken } from "../../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../../util/util";

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);
  const userToken = useGetToken();

  const [loadingState, setLoadingState] = useState({
    caseNo: false,
    mobileNo: false,
  });
  const [sliderState, setSliderState] = useState(false);
  const [paymentTable, setPaymentTable] = useState([]);
  const [registered, setRegistered] = useState(false);
  const [allData, setAllData] = useState({});
  const [animalPhotoOne, setAnimalPhotoOne] = useState("");
  const [animalPhotoTwo, setAnimalPhotoTwo] = useState("");
  const [animalPhotoThree, setAnimalPhotoThree] = useState("");
  const [opdDropDown, setOpdDropDown] = useState([]);
  const [areaDropDown, setAreaDropDown] = useState([]);
  const [zoneDropDown, setZoneDropDown] = useState([]);
  const [wardDropDown, setWardDropDown] = useState([]);
  const [petAnimal, setPetAnimal] = useState([]);
  const [petBreeds, setPetBreeds] = useState([]);
  const [multiplePets, setMultiplePets] = useState([]);

  const [loader, setLoader] = useState(false);
  const [paymentLoader, setPaymentLoader] = useState(false);

  let opdSchema = yup.object().shape({
    firstName: yup
      .string()
      .required(
        language === "en"
          ? "Please enter first name in english"
          : "कृपया इंग्रजीमध्ये प्रथम नाव प्रविष्ट करा"
      )
      .matches(
        /^[A-Za-z0-9०-९\u0900-\u097F\s]+$/,
        language === "en"
          ? "Must be only english or marathi characters"
          : "फक्त इंग्लिश किंवा मराठी शब्द "
      ),
    middleName: yup
      .string()
      .required(
        language === "en"
          ? "Please enter middle name in english"
          : "कृपया इंग्रजीमध्ये मधले नाव प्रविष्ट करा"
      )
      .matches(
        /^[A-Za-z0-9०-९\u0900-\u097F\s]+$/,
        language === "en"
          ? "Must be only english or marathi characters"
          : "फक्त इंग्लिश किंवा मराठी शब्द "
      ),
    lastName: yup
      .string()
      .required(
        language === "en"
          ? "Please enter last name in english"
          : "कृपया इंग्रजीमध्ये आडनाव प्रविष्ट करा"
      )
      .matches(
        /^[A-Za-z0-9०-९\u0900-\u097F\s]+$/,
        language === "en"
          ? "Must be only english or marathi characters"
          : "फक्त इंग्लिश किंवा मराठी शब्द "
      ),
    firstNameMr: yup
      .string()
      .required(
        language === "en"
          ? "Please enter first name in marathi"
          : "कृपया मराठीत पहिले नाव टाका"
      )
      .matches(
        /^[A-Za-z0-9०-९\u0900-\u097F\s]+$/,
        language === "en"
          ? "Must be only english or marathi characters"
          : "फक्त इंग्लिश किंवा मराठी शब्द "
      ),
    middleNameMr: yup
      .string()
      .required(
        language === "en"
          ? "Please enter middle name in marathi"
          : "कृपया मधले नाव मराठीत टाका"
      )
      .matches(
        /^[A-Za-z0-9०-९\u0900-\u097F\s]+$/,
        language === "en"
          ? "Must be only english or marathi characters"
          : "फक्त इंग्लिश किंवा मराठी शब्द "
      ),
    lastNameMr: yup
      .string()
      .required(
        language === "en"
          ? "Please enter last name in marathi"
          : "कृपया मराठीत आडनाव टाका"
      )
      .matches(
        /^[A-Za-z0-9०-९\u0900-\u097F\s]+$/,
        language === "en"
          ? "Must be only english or marathi characters"
          : "फक्त इंग्लिश किंवा मराठी शब्द "
      ),
    // ownerFullName: yup
    //   .string()
    //   .required('Please enter full name')
    //   .typeError('Please enter full name'),
    ownerAddress: yup
      .string()
      .required(
        language === "en"
          ? "Please enter full address"
          : "कृपया पूर्ण पत्ता प्रविष्ट करा"
      )
      .typeError(
        language === "en"
          ? "Please enter full address"
          : "कृपया पूर्ण पत्ता प्रविष्ट करा"
      ),
    animalAge: yup
      .string()
      .required(
        language === "en"
          ? "Please enter age of pet"
          : "कृपया पाळीव प्राण्याचे वय प्रविष्ट करा"
      )
      .typeError(
        language === "en"
          ? "Please enter age of pet"
          : "कृपया पाळीव प्राण्याचे वय प्रविष्ट करा"
      ),
    animalColour: yup
      .string()
      .required(
        language === "en"
          ? "Please enter color of pet"
          : "कृपया पाळीव प्राण्यांचा रंग प्रविष्ट करा"
      )
      .typeError(
        language === "en"
          ? "Please enter color of pet"
          : "कृपया पाळीव प्राण्यांचा रंग प्रविष्ट करा"
      ),
    petName: yup
      .string()
      .required(
        language === "en"
          ? `Please enter pet's name`
          : "कृपया पाळीव प्राण्याचे नाव प्रविष्ट करा"
      )
      .typeError(
        language === "en"
          ? `Please enter pet's name`
          : "कृपया पाळीव प्राण्याचे नाव प्रविष्ट करा"
      ),
    // symptoms: yup.string().required().typeError('Please enter the symptoms'),
    animalName: yup
      .number()
      .required(
        language === "en" ? "Please select an animal" : "कृपया एक प्राणी निवडा"
      )
      .typeError(
        language === "en" ? "Please select an animal" : "कृपया एक प्राणी निवडा"
      ),
    animalSex: yup
      .string()
      .required(
        language === "en" ? "Please select a gender" : "कृपया लिंग निवडा"
      )
      .typeError(
        language === "en" ? "Please select a gender" : "कृपया लिंग निवडा"
      ),
    animalSpeciesKey: yup
      .number()
      .required(
        language === "en" ? "Please select a breed" : "कृपया एक जात निवडा"
      )
      .typeError(
        language === "en" ? "Please select a breed" : "कृपया एक जात निवडा"
      ),
    opdKey: yup
      .number()
      .required(
        language === "en" ? "Please select an OPD" : "कृपया एक OPD निवडा"
      )
      .typeError(
        language === "en" ? "Please select an OPD" : "कृपया एक OPD निवडा"
      ),
    zoneKey: yup
      .number()
      .required(
        language === "en" ? "Please select a zone" : "कृपया एक झोन निवडा"
      )
      .typeError(
        language === "en" ? "Please select a zone" : "कृपया एक झोन निवडा"
      ),
    wardKey: yup
      .number()
      .required(
        language === "en" ? "Please select a ward" : "कृपया प्रभाग निवडा"
      )
      .typeError(
        language === "en" ? "Please select a ward" : "कृपया प्रभाग निवडा"
      ),
    areaKey: yup
      .number()
      .required(
        language === "en" ? "Please select an area" : "कृपया क्षेत्र निवडा"
      )
      .typeError(
        language === "en" ? "Please select an area" : "कृपया क्षेत्र निवडा"
      ),
    mobileNumber: yup
      .string()
      .required(
        language === "en"
          ? "Please enter a mobile number"
          : "कृपया मोबाईल नंबर टाका"
      )
      // .matches(/^[0-9]+$/, 'Must be only digits')
      .matches(
        /^[6-9][0-9]+$/,
        language === "en" ? "Invalid mobile no." : "अवैध मोबाईल नंबर"
      )
      .min(
        10,
        language === "en"
          ? "Mobile Number must be of 10 digits"
          : "मोबाईल नंबर 10 अंकी असणे आवश्यक आहे"
      )
      .max(
        10,
        language === "en"
          ? "Mobile Number must be of 10 digits"
          : "मोबाईल नंबर 10 अंकी असणे आवश्यक आहे"
      ),
    emailAddress: yup
      .string()
      .email()
      .required(
        language === "en"
          ? "Please enter an e-mail address"
          : "कृपया ईमेल एंटर करा"
      )
      .typeError(language === "en" ? "Invalid email address" : "अवैध ईमेल"),
    paymentMode: yup
      .string()
      .required(
        language === "en"
          ? "Please select a payment category"
          : "कृपया पेमेंट श्रेणी निवडा"
      ),
    payerName: yup
      .string()
      .required(
        language === "en"
          ? "Please enter payer's name"
          : "कृपया देयकाचे नाव प्रविष्ट करा"
      ),
    payerAddress: yup
      .string()
      .required(
        language === "en"
          ? "Please enter payer's address"
          : "कृपया देयकाचा पत्ता प्रविष्ट करा"
      ),
    receiptDate: yup
      .string()
      .required(
        language === "en"
          ? "Please select a receipt date"
          : "कृपया पावतीची तारीख निवडा"
      ),
    narration: yup
      .string()
      .required(
        language === "en"
          ? "Please enter a narration"
          : "कृपया एक कथन प्रविष्ट करा"
      ),
  });

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(opdSchema),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    // watch,
    formState: { errors: error },
  } = methods;

  useEffect(() => {
    !registered && clearData();

    sliderState ? setValue("casePaperNo", "") : setValue("mobileNo", "");
  }, [registered, sliderState]);

  useEffect(() => {
    !router.query.id && clearData();

    //Get OPD
    axios
      .get(`${URLs.VMS}/mstOpd/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setOpdDropDown(
          res.data.mstOpdList.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            opdEn: j.opdName,
          }))
        );
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language);
      });

    !router.query.id && getZones();

    axios
      .get(`${URLs.CFCURL}/master/zoneWardAreaMapping/getAlll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setAreaDropDown(
          res.data?.map((j) => ({
            // id: j?.id,
            // id: j?.uniqueId,
            id: j?.area,
            zone: j?.zoneId,
            ward: j?.wardId,
            area: j?.areaId,
            areaDisplayNameEn:
              j?.areaName + " - " + j?.zoneName + " - " + j?.wardName,
            areaDisplayNameMr:
              j?.areaNameMr + " - " + j?.zoneNameMr + " - " + j?.wardNameMr,
          }))
        );
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language);
      });

    //Get Zone
    router.query.id &&
      axios
        .get(`${URLs.CFCURL}/master/zone/getAll`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setZoneDropDown(
            res.data.zone.map((j, i) => ({
              srNo: i + 1,
              id: j.id,
              zoneEn: j.zoneName,
              zoneMr: j.zoneNameMr,
            }))
          );
        })
        .catch((error) => {
          catchExceptionHandlingMethod(error, language);
        });

    //Get Ward
    router.query.id &&
      axios
        .get(`${URLs.CFCURL}/master/ward/getAll`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setWardDropDown(
            res.data.ward.map((j, i) => ({
              srNo: i + 1,
              id: j.id,
              wardEn: j.wardName,
              wardMr: j.wardNameMr,
            }))
          );
        })
        .catch((error) => {
          catchExceptionHandlingMethod(error, language);
        });

    //Get Pet Animals
    axios
      .get(`${URLs.VMS}/mstPetAnimal/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setPetAnimal(() => {
          sortByAsc(res.data.mstPetAnimalList, "nameEn");
          return res.data.mstPetAnimalList.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            nameEn: j.nameEn,
            nameMr: j.nameMr,
          }));
        });
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language);
      });

    //Get Pet Breeds
    axios
      .get(`${URLs.VMS}/mstAnimalBreed/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setPetBreeds(() => {
          sortByAsc(res.data.mstAnimalBreedList, "breedNameEn");
          return res.data.mstAnimalBreedList.map((j, i) => ({
            id: j.id,
            breedNameEn: j.breedNameEn,
            breedNameMr: j.breedNameMr,
            petAnimalKey: j.petAnimalKey,
          }));
        });
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language);
      });

    if (router.query.id) {
      setLoader(true);

      axios
        .get(`${URLs.VMS}/trnAnimalTreatment/getById`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          params: { id: router.query.id },
        })
        .then((res) => {
          setAllData({
            ...res?.data,
            licenseNo: !!res?.licenseNo ? res?.licenseNo : "---",
          });
          reset({
            ...res?.data,
            licenseNo: !!res?.licenseNo ? res?.licenseNo : "---",
            amount: 20,
          });
          setAnimalPhotoOne(res.data.photoOne);
          setAnimalPhotoTwo(res.data.photoTwo);
          setAnimalPhotoThree(res.data.photoThree);

          if (res.data.casePaperNo) {
            getPaymentData(res.data.casePaperNo);
          }
          setLoader(false);
        })
        .catch((error) => {
          catchExceptionHandlingMethod(error, language);
          setLoader(false);
        });
    }
  }, []);

  const payment = () => {
    router.push({
      pathname: `/veterinaryManagementSystem/transactions/opd/paymentGateway`,
      query: { id: router.query.id },
    });
  };

  const columns = [
    {
      headerClassName: "cellColor",

      field: "srNo",
      headerAlign: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 80,
    },
    {
      headerClassName: "cellColor",

      field: "amount",
      headerAlign: "center",
      headerName: <FormattedLabel id="amount" />,
      width: 150,
    },
    {
      headerClassName: "cellColor",

      field: "payerName",
      headerAlign: "center",
      headerName: <FormattedLabel id="payerName" />,
      flex: 1,
    },
    {
      headerClassName: "cellColor",

      field: "narration",
      headerAlign: "center",
      headerName: <FormattedLabel id="narration" />,
      flex: 1,
    },
  ];

  useEffect(() => {
    console.log("registeredData: ", watch("registeredData"));
  }, [watch("registeredData")]);

  const getPetData = () => {
    let licenseNo = watch("licenseNo");
    axios
      .post(
        `${URLs.VMS}/trnPetLicence/getByPetLicenceNo`,
        {
          petLicenceNo: licenseNo,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        const { paymentKey, id, activeFlag, ...rest } = res.data;
        reset({
          ...rest,
          ownerFullName: res.data.ownerName,
          ownerAddress:
            res.data.addrFlatOrHouseNo +
            ", " +
            res.data.addrBuildingName +
            ", " +
            res.data.detailAddress,
          emailAddress: res.data.ownerEmailId,
          mobileNumber: res.data.ownerMobileNo,
          animalName: res.data.petAnimalKey,
          animalColour: res.data.animalColor,
          animalSex: res.data.animalGender == "Male" ? "M" : "F",
          animalSpeciesKey: res.data.animalBreedKey,
          opdKey: watch("opdKey"),
          receiptDate:
            res.data.receiptDate ?? moment(new Date()).format("YYYY-MM-DD"),
          amount: 20,
        });
        setAnimalPhotoOne(res?.data?.petAnimalPhoto);
        setValue("licenseNo", res.data.petLicenceNo);
        setValue("registeredData", true);

        getWards(res?.data?.zoneKey);
        getAreas(res?.data?.zoneKey, res?.data?.wardKey);
      })
      .catch((error) => {
        if (error.response.status == 401) {
          catchExceptionHandlingMethod(error, language);
        } else {
          sweetAlert({
            title:
              language === "en"
                ? "Incorrect License No."
                : "चुकीचा परवाना क्रमांक.",
            text:
              language === "en"
                ? "Details not found for the entered license no"
                : "प्रविष्ट केलेल्या परवाना क्रमांकासाठी तपशील आढळले नाहीत",
            icon: "warning",
            buttons: [
              language === "en" ? "Cancel" : "रद्द करा",
              language === "en" ? "Ok" : "ठीक आहे",
            ],
          });
        }
      });
  };

  const getZones = () => {
    axios
      .get(`${URLs.CFCURL}/master/zoneWardAreaMapping/getZoneByApplicationId`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) =>
        setZoneDropDown(
          res.data.map((zones) => ({
            id: zones.zoneId,
            zoneEn: zones.zoneName,
            zoneMr: zones.zoneNameMr,
          }))
        )
      )
      .catch((error) => {
        catchExceptionHandlingMethod(error, language);
      });
  };
  const getWards = (zoneId) => {
    axios
      .get(
        `${URLs.CFCURL}/master/zoneWardAreaMapping/getWardByZoneAndModuleId`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          params: { zoneId },
        }
      )
      .then((res) =>
        setWardDropDown(
          res.data.map((wards) => ({
            id: wards.wardId,
            wardEn: wards.wardName,
            wardMr: wards.wardNameMr,
          }))
        )
      )
      .catch((error) => {
        catchExceptionHandlingMethod(error, language);
      });
  };

  const getAreas = (zoneId, wardId) => {
    axios
      .get(
        `${URLs.CFCURL}/master/zoneWardAreaMapping/getAreaByZoneAndWardAndModuleId`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          params: { zoneId, wardId },
        }
      )
      .then((res) =>
        setAreaDropDown(
          res.data.map((areas) => ({
            // id: areas.areaId,
            // areaEn: areas.areaName,
            // areaMr: areas.areaNameMr,
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
          }))
        )
      )
      .catch((error) => {
        catchExceptionHandlingMethod(error, language);
      });
  };

  const clearData = () => {
    let searchFields = {
      casePaperNo: watch("casePaperNo"),
      mobileNo: watch("mobileNo"),
    };
    reset({
      petName: "",
      animalColour: "",
      animalSpeciesKey: "",
      animalSex: "",
      animalAge: "",
      animalName: "",
      areaKey: "",
      wardKey: "",
      zoneKey: "",
      mobileNumber: "",
      emailAddress: "",
      ownerAddress: "",
      ownerFullName: "",
      licenseNo: "",
      opdKey: null,

      // mobileNo: '',
      // casePaperNo: '',

      paymentMode: "",
      payerName: "",
      payerAddress: "",
    });
    setAnimalPhotoOne("");
    setAnimalPhotoTwo("");
    setAnimalPhotoThree("");

    setValue("receiptDate", moment(new Date()).format("YYYY-MM-DD"));
    setValue("narration", "OPD Registration");
    setValue("amount", 20);

    setValue("casePaperNo", searchFields.casePaperNo);
    setValue("mobileNo", searchFields.mobileNo);

    setPaymentTable([]);
  };

  const getCaseData = () => {
    sliderState
      ? setLoadingState({ caseNo: false, mobileNo: true })
      : setLoadingState({ caseNo: true, mobileNo: false });
    axios
      .get(
        `${URLs.VMS}/trnAnimalTreatment/${
          sliderState ? "getAllByMobileNumber" : "findByCasePaperNo"
        }`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          params: sliderState
            ? { mobileNumber: watch("mobileNo") }
            : { casePaperNo: watch("casePaperNo") },
        }
      )
      .then((res) => {
        if (sliderState) {
          if (res.data?.trnAnimalTreatmentList.length > 0) {
            res.data?.trnAnimalTreatmentList.length > 1
              ? setMultiplePets(res?.data?.trnAnimalTreatmentList)
              : setCaseData(res?.data?.trnAnimalTreatmentList[0]);
          } else {
            sweetAlert(
              language === "en" ? "No Data Found" : "माहिती आढळली नाही",
              language === "en"
                ? "Please enter correct mobile no."
                : "कृपया योग्य मोबाईल नंबर टाका",
              "info",
              { button: language === "en" ? "Ok" : "ठीक आहे" }
            );
          }
        } else {
          setCaseData(res?.data);
        }

        setLoadingState({ caseNo: false, mobileNo: false });
      })
      .catch((error) => {
        if (error.response.status == 401) {
          catchExceptionHandlingMethod(error, language);
        } else {
          console.log(error);
          clearData();
          setLoadingState({ caseNo: false, mobileNo: false });
          error?.response?.status == 404 || error?.response?.status == 400
            ? sweetAlert(
                language === "en" ? "No Data Found" : "माहिती आढळली नाही",
                language === "en"
                  ? "Please enter correct case paper no."
                  : "कृपया योग्य केसपेपर क्रमांक प्रविष्ट करा",
                "info",
                { button: language === "en" ? "Ok" : "ठीक आहे" }
              )
            : sweetAlert(
                language === "en" ? "Error!" : "त्रुटी!",
                language === "en" ? "Something went wrong" : "काहीतरी चूक झाली",
                "error",
                { button: language === "en" ? "Ok" : "ठीक आहे" }
              );
        }
      });
  };

  const getPaymentData = (casePaperNo) => {
    setPaymentLoader(true);
    axios
      .get(`${URLs.VMS}/trnAnimalTreatment/getAllPaymentByCasePaperNo`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params: { casePaperNo },
      })
      .then((res) => {
        if (res.data.paymentList.length > 0) {
          setPaymentTable(
            res.data.paymentList.map((j, i) => ({ srNo: i + 1, ...j }))
          );
        } else {
          sweetAlert({
            title: "Not Found",
            text: "No payment history found.",
            icon: "warning",
            buttons: [
              language === "en" ? "Cancel" : "रद्द करा",
              language === "en" ? "Ok" : "ठीक आहे",
            ],
          });
        }
        setPaymentLoader(false);
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language);
        setPaymentLoader(false);
      });
  };

  const setCaseData = (obj) => {
    const {
      paymentKey,
      casePaperPaymentKey,
      paymentMode,
      payerName,
      payerAddress,
      receiptDate,
      narration,
      amount,
      ...restCaseData
    } = obj;

    reset({
      ...restCaseData,
      receiptDate: moment(new Date()).format("YYYY-MM-DD"),
      amount: 20,
    });

    setAnimalPhotoOne(obj?.photoOne);
    setAnimalPhotoTwo(obj?.photoTwo);
    setAnimalPhotoThree(obj?.photoThree);

    getPaymentData(obj?.casePaperNo);
    getWards(obj?.zoneKey);
    getAreas(obj?.zoneKey, obj?.wardKey);
  };

  const finalSubmit = (data) => {
    const { id, casePaperNo, opdMedicineDao, ...restData } = data;

    const finalBody = registered
      ? {
          ...restData,
          casePaperNo,
          photoOne: animalPhotoOne,
          photoTwo: animalPhotoTwo,
          photoThree: animalPhotoThree,
          status: "Initiated",
          existingCasePaperNo: registered,
        }
      : {
          ...restData,
          photoOne: animalPhotoOne,
          photoTwo: animalPhotoTwo,
          photoThree: animalPhotoThree,
          status: "Initiated",
          existingCasePaperNo: registered,
        };

    console.table("OPDdata: ", finalBody);

    sweetAlert({
      title: language === "en" ? "Confirmation" : "पुष्टीकरण",
      text:
        language === "en"
          ? "Are you sure you want to submit the application ?"
          : "तुमची खात्री आहे की तुम्ही अर्ज सबमिट करू इच्छिता?",
      icon: "warning",
      buttons: [
        language === "en" ? "Cancel" : "रद्द करा",
        language === "en" ? "Save" : "जतन करा",
      ],
    }).then((ok) => {
      if (ok) {
        setLoader(true);
        axios
          .post(`${URLs.VMS}/trnAnimalTreatment/save`, finalBody, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((res) => {
            if (res.status == 200 || res.status == 201) {
              sweetAlert(
                language === "en" ? "Success" : "यशस्वी झाले",
                language === "en"
                  ? "Patient record created successfully !"
                  : "पेशंटचे रेकॉर्ड यशस्वीरित्या तयार केल",
                "success",
                { button: language === "en" ? "Ok" : "ठीक आहे" }
              );
              router.push(`/veterinaryManagementSystem/transactions/opd/clerk`);
            }
            setLoader(false);
          })
          .catch((error) => {
            catchExceptionHandlingMethod(error, language);
            setLoader(false);
          });
      }
    });
  };

  return (
    <>
      <Head>
        <title>Treating sick and injured animals through OPD</title>
      </Head>
      <Breadcrumb />

      <Paper className={styles.main}>
        <Title titleLabel={<FormattedLabel id="opdHeading" />} />
        {loader && <Loader />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(finalSubmit)}>
            {!router.query.id && (
              <div className={styles.row} style={{ justifyContent: "center" }}>
                <FormControl
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "18px",
                      marginRight: 50,
                      fontWeight: "400",
                    }}
                  >
                    <FormattedLabel id="petRegistrationStatus" /> :
                  </span>
                  <RadioGroup
                    name="treatmentStatus"
                    sx={{ gap: 5 }}
                    onChange={(e) => {
                      e.target.value == "true"
                        ? setRegistered(true)
                        : setRegistered(false);
                    }}
                    defaultValue={registered}
                    row
                  >
                    <FormControlLabel
                      value="false"
                      control={<Radio />}
                      label={<FormattedLabel id="new" />}
                    />
                    <FormControlLabel
                      value="true"
                      control={<Radio />}
                      label={<FormattedLabel id="existing" />}
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            )}
            {(registered || router.query.id) && (
              <div
                className={styles.row}
                style={{ justifyContent: "center", gap: 50 }}
              >
                <TextField
                  disabled={!!router.query.id || sliderState}
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="casePaperNo" />}
                  variant="standard"
                  {...register("casePaperNo")}
                  InputLabelProps={{
                    shrink: !!router.query.id || watch("casePaperNo"),
                  }}
                  error={!!error.casePaperNo}
                  helperText={
                    error?.casePaperNo ? error.casePaperNo.message : null
                  }
                  InputProps={{
                    endAdornment: !router.query.id && !sliderState && (
                      <InputAdornment position="end">
                        <IconButton
                          disabled={
                            router.query.id || sliderState ? true : false
                          }
                          sx={{ color: "#1976D2" }}
                          onClick={() => {
                            getCaseData();
                          }}
                        >
                          <Search />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {loadingState.caseNo && (
                  <svg className={styles.loader} viewBox="25 25 50 50">
                    <circle r="20" cy="50" cx="50"></circle>
                  </svg>
                )}
                {!router.query.id && (
                  <>
                    <Slider slide={sliderState} setSlider={setSliderState} />
                    <TextField
                      disabled={!sliderState}
                      sx={{ width: "250px" }}
                      label={<FormattedLabel id="mobileNo" />}
                      variant="standard"
                      {...register("mobileNo")}
                      InputLabelProps={{
                        shrink:
                          router.query.id || watch("mobileNo") ? true : false,
                      }}
                      error={!!error.mobileNo}
                      helperText={
                        error?.mobileNo ? error.mobileNo.message : null
                      }
                      InputProps={{
                        endAdornment: !router.query.id && sliderState && (
                          <InputAdornment position="end">
                            <IconButton
                              disabled={!sliderState}
                              sx={{ color: "#1976D2" }}
                              onClick={() => {
                                getCaseData();
                              }}
                            >
                              <Search />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </>
                )}
                {loadingState.mobileNo && (
                  <svg className={styles.loader} viewBox="25 25 50 50">
                    <circle r="20" cy="50" cx="50"></circle>
                  </svg>
                )}
              </div>
            )}

            <Slide
              direction={multiplePets.length > 0 ? "right" : "left"}
              in={multiplePets.length > 0}
              mountOnEnter
              unmountOnExit
            >
              <div className={styles.multiplePets}>
                {multiplePets.map((obj) => (
                  <PetCard
                    key={obj["casePaperNo"]}
                    petName={obj["petName"]}
                    casePaperNo={obj["casePaperNo"]}
                    onClick={() => {
                      setCaseData(obj);
                      setMultiplePets([]);
                    }}
                  />
                ))}
              </div>
            </Slide>
            <div className={styles.row}>
              <FormControl
                disabled={!!router.query.id || registered}
                variant="standard"
                error={!!error.opdKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="opd" />
                </InputLabel>
                {/* @ts-ignore */}
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ width: "250px" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="opdKey"
                    >
                      {opdDropDown &&
                        opdDropDown.map((obj) => (
                          <MenuItem key={1} value={obj.id}>
                            {/* {language === "en" ? obj.opdEn : obj.opdMr} */}
                            {obj?.opdEn}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="opdKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {error?.opdKey ? error.opdKey.message : null}
                </FormHelperText>
              </FormControl>

              <TextField
                disabled={!!router.query.id || registered}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="licenseNo" />}
                variant="standard"
                {...register("licenseNo")}
                InputLabelProps={{
                  shrink: !!router.query.id || watch("licenseNo"),
                }}
                error={!!error.licenseNo}
                helperText={error?.licenseNo ? error.licenseNo.message : null}
                InputProps={{
                  endAdornment: !router.query.id && !registered && (
                    <InputAdornment position="end">
                      <IconButton
                        disabled={!!router.query.id || registered}
                        sx={{ color: "#1976D2" }}
                        onClick={() => {
                          getPetData();
                        }}
                      >
                        <Search />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <div style={{ width: 250 }}></div>
            </div>
            <div className={styles.row}>
              <div style={{ width: 250 }}>
                <Transliteration
                  fieldName={"firstName"}
                  updateFieldName={"firstNameMr"}
                  sourceLang={"eng"}
                  targetLang={"mar"}
                  label={<FormattedLabel id="fNameEn" required />}
                  error={!!error.firstName}
                  targetError={"firstName"}
                  width={250}
                  InputLabelProps={{
                    shrink: !!watch("firstName"),
                  }}
                  helperText={error?.firstName ? error.firstName.message : null}
                  disabled={
                    !!router.query.id || registered || watch("registeredData")
                  }
                />
              </div>
              <div style={{ width: 250 }}>
                <Transliteration
                  fieldName={"middleName"}
                  updateFieldName={"middleNameMr"}
                  sourceLang={"eng"}
                  targetLang={"mar"}
                  label={<FormattedLabel id="mNameEn" required />}
                  error={!!error.middleName}
                  targetError={"middleName"}
                  width={250}
                  InputLabelProps={{
                    shrink: !!watch("middleName"),
                  }}
                  helperText={
                    error?.middleName ? error.middleName.message : null
                  }
                  disabled={
                    !!router.query.id || registered || watch("registeredData")
                  }
                />
              </div>
              <div style={{ width: 250 }}>
                <Transliteration
                  fieldName={"lastName"}
                  updateFieldName={"lastNameMr"}
                  sourceLang={"eng"}
                  targetLang={"mar"}
                  label={<FormattedLabel id="lNameEn" required />}
                  error={!!error.lastName}
                  targetError={"lastName"}
                  width={250}
                  InputLabelProps={{
                    shrink: !!watch("lastName"),
                  }}
                  helperText={error?.lastName ? error.lastName.message : null}
                  disabled={
                    !!router.query.id || registered || watch("registeredData")
                  }
                />
              </div>
              {/* <TextField
                sx={{ width: '250px' }}
                label={<FormattedLabel id='fNameEn' />}
                disabled={!!router.query.id || registered}
                variant='standard'
                {...register('firstName')}
                error={!!error.firstName}
                InputLabelProps={{
                  shrink: router.query.id || watch('firstName'),
                }}
                helperText={error?.firstName ? error.firstName.message : null}
              />
              <TextField
                sx={{ width: '250px' }}
                label={<FormattedLabel id='mNameEn' />}
                disabled={!!router.query.id || registered}
                variant='standard'
                {...register('middleName')}
                error={!!error.middleName}
                InputLabelProps={{
                  shrink: router.query.id || watch('middleName'),
                }}
                helperText={error?.middleName ? error.middleName.message : null}
              />
              <TextField
                sx={{ width: '250px' }}
                label={<FormattedLabel id='lNameEn' />}
                disabled={!!router.query.id || registered}
                variant='standard'
                {...register('lastName')}
                error={!!error.lastName}
                InputLabelProps={{
                  shrink: router.query.id || watch('lastName'),
                }}
                helperText={error?.lastName ? error.lastName.message : null}
              /> */}
              {/* <TextField
              sx={{ width: '250px' }}
              label={<FormattedLabel id='ownerName' />}
              disabled={!!router.query.id || registered}
              variant='standard'
              {...register('ownerFullName')}
              error={!!error.ownerFullName}
              InputLabelProps={{
                shrink: router.query.id || watch('ownerFullName'),
              }}
              helperText={
                error?.ownerFullName ? error.ownerFullName.message : null
              }
            /> */}
            </div>
            <div className={styles.row}>
              <TextField
                sx={{ width: "250px" }}
                label={<FormattedLabel id="fNameMr" />}
                disabled={
                  !!router.query.id || registered || watch("registeredData")
                }
                variant="standard"
                {...register("firstNameMr")}
                error={!!error.firstNameMr}
                InputLabelProps={{
                  shrink: router.query.id || watch("firstNameMr"),
                }}
                helperText={
                  error?.firstNameMr ? error.firstNameMr.message : null
                }
              />
              <TextField
                sx={{ width: "250px" }}
                label={<FormattedLabel id="mNameMr" />}
                disabled={
                  !!router.query.id || registered || watch("registeredData")
                }
                variant="standard"
                {...register("middleNameMr")}
                error={!!error.middleNameMr}
                InputLabelProps={{
                  shrink: router.query.id || watch("middleNameMr"),
                }}
                helperText={
                  error?.middleNameMr ? error.middleNameMr.message : null
                }
              />
              <TextField
                sx={{ width: "250px" }}
                label={<FormattedLabel id="lNameMr" />}
                disabled={
                  !!router.query.id || registered || watch("registeredData")
                }
                variant="standard"
                {...register("lastNameMr")}
                error={!!error.lastNameMr}
                InputLabelProps={{
                  shrink: router.query.id || watch("lastNameMr"),
                }}
                helperText={error?.lastNameMr ? error.lastNameMr.message : null}
              />
            </div>

            <div className={styles.row}>
              <TextField
                multiline
                sx={{ width: "250px" }}
                label={<FormattedLabel id="ownerAddress" />}
                disabled={!!router.query.id || registered}
                // @ts-ignore
                //   value={router.query.id && applicationDetails.ownerAddress}
                variant="standard"
                {...register("ownerAddress")}
                error={!!error.ownerAddress}
                InputLabelProps={{
                  shrink: router.query.id || watch("ownerAddress"),
                }}
                helperText={
                  error?.ownerAddress ? error.ownerAddress.message : null
                }
              />
              <TextField
                sx={{ width: "250px" }}
                label={<FormattedLabel id="emailId" />}
                disabled={!!router.query.id || registered}
                // @ts-ignore
                //   value={router.query.id && applicationDetails.emailAddress}
                variant="standard"
                {...register("emailAddress")}
                error={!!error.emailAddress}
                InputLabelProps={{
                  shrink: router.query.id || watch("emailAddress"),
                }}
                helperText={
                  error?.emailAddress ? error.emailAddress.message : null
                }
              />
              <TextField
                sx={{ width: "250px" }}
                label={<FormattedLabel id="mobileNo" />}
                disabled={!!router.query.id || registered}
                // @ts-ignore
                //   value={router.query.id && applicationDetails.mobileNumber}
                variant="standard"
                {...register("mobileNumber")}
                error={!!error.mobileNumber}
                InputLabelProps={{
                  shrink: router.query.id || watch("mobileNumber"),
                }}
                helperText={
                  error?.mobileNumber ? error.mobileNumber.message : null
                }
              />
            </div>
            <div className={styles.row}>
              <FormControl
                disabled={
                  !!router.query.id || registered || areaDropDown.length == 0
                }
                variant="standard"
                error={!!error.areaKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="area" />
                </InputLabel>
                {/* @ts-ignore */}
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
                        let tempObjForZoneAndWard = areaDropDown?.find(
                          (j) => j?.area == value.target.value
                        );
                        getWards(tempObjForZoneAndWard?.zone);
                        setValue("zoneKey", tempObjForZoneAndWard?.zone);
                        setValue("wardKey", tempObjForZoneAndWard?.ward);
                      }}
                      label="areaKey"
                    >
                      {areaDropDown &&
                        areaDropDown.map((value, index) => (
                          <MenuItem
                            key={index}
                            value={
                              //@ts-ignore
                              value.area
                            }
                          >
                            {/* {language == 'en'
                            ? //@ts-ignore
                              value.areaEn
                            : // @ts-ignore
                              value?.areaMr} */}
                            {language == "en"
                              ? //@ts-ignore
                                value?.areaDisplayNameEn
                              : // @ts-ignore
                                value?.areaDisplayNameMr}
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
              <FormControl
                disabled={!!router.query.id || registered}
                variant="standard"
                error={!!error.zoneKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="zone" />
                </InputLabel>
                {/* @ts-ignore */}
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
                        !router.query.id && getWards(value.target.value);
                        !router.query.id && setValue("wardKey", "");
                        !router.query.id && setValue("areaKey", "");
                      }}
                      label="zoneKey"
                    >
                      {zoneDropDown &&
                        zoneDropDown.map((value, index) => (
                          <MenuItem
                            key={index}
                            value={
                              //@ts-ignore
                              value.id
                            }
                          >
                            {language == "en"
                              ? //@ts-ignore
                                value.zoneEn
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
                  {error?.zoneKey ? error.zoneKey.message : null}
                </FormHelperText>
              </FormControl>
              <FormControl
                disabled={
                  !!router.query.id || registered || wardDropDown.length == 0
                }
                variant="standard"
                error={!!error.wardKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="ward" />
                </InputLabel>
                {/* @ts-ignore */}
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
                          getAreas(watch("zoneKey"), value.target.value);
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
                  {error?.wardKey ? error.wardKey.message : null}
                </FormHelperText>
              </FormControl>
            </div>
            <div className={styles.subTitle}>
              <FormattedLabel id="animalDetails" />
            </div>
            <div className={styles.row}>
              <FormControl
                disabled={router.query.id || registered ? true : false}
                variant="standard"
                error={!!error.animalName}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="petAnimal" />
                </InputLabel>
                {/* @ts-ignore */}
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ width: "250px" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="animalName"
                    >
                      {petAnimal &&
                        petAnimal.map((obj) => (
                          <MenuItem key={1} value={obj.id}>
                            {language === "en" ? obj.nameEn : obj.nameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="animalName"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {error?.animalName ? error.animalName.message : null}
                </FormHelperText>
              </FormControl>
              <TextField
                disabled={router.query.id || registered ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="animalAge" />}
                // @ts-ignore
                variant="standard"
                {...register("animalAge")}
                error={!!error.animalAge}
                InputLabelProps={{
                  shrink: router.query.id || watch("animalAge") ? true : false,
                }}
                helperText={error?.animalAge ? error.animalAge.message : null}
              />
              <FormControl
                disabled={router.query.id || registered ? true : false}
                variant="standard"
                error={!!error.animalSex}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="animalGender" />
                </InputLabel>
                {/* @ts-ignore */}
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ width: "250px" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      // @ts-ignore
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="animalSex"
                    >
                      <MenuItem key={1} value={"M"}>
                        {language === "en" ? "Male" : "पुरुष"}
                      </MenuItem>
                      <MenuItem key={2} value={"F"}>
                        {language === "en" ? "Female" : "स्त्री"}
                      </MenuItem>
                    </Select>
                  )}
                  name="animalSex"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {error?.animalSex ? error.animalSex.message : null}
                </FormHelperText>
              </FormControl>
            </div>
            <div className={styles.row}>
              <FormControl
                disabled={router.query.id || registered ? true : false}
                variant="standard"
                error={!!error.animalSpeciesKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="animalBreed" />
                </InputLabel>
                {/* @ts-ignore */}
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ width: "250px" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      // @ts-ignore
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="animalSpeciesKey"
                    >
                      {petBreeds &&
                        petBreeds
                          .filter((obj) => {
                            //   return obj.petAnimalKey == router.query.petAnimal;
                            return obj.petAnimalKey == watch("animalName");
                          })
                          .map((obj, index) => (
                            <MenuItem key={index} value={obj.id}>
                              {language === "en"
                                ? obj.breedNameEn
                                : obj.breedNameMr}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="animalSpeciesKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {error?.animalSpeciesKey
                    ? error.animalSpeciesKey.message
                    : null}
                </FormHelperText>
              </FormControl>
              <TextField
                disabled={router.query.id || registered ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="animalColor" />}
                // @ts-ignore
                variant="standard"
                {...register("animalColour")}
                error={!!error.animalColour}
                InputLabelProps={{
                  shrink:
                    router.query.id || watch("animalColour") ? true : false,
                }}
                helperText={
                  error?.animalColour ? error.animalColour.message : null
                }
              />
              <TextField
                disabled={router.query.id || registered ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="petName" />}
                // @ts-ignore
                variant="standard"
                {...register("petName")}
                error={!!error.petName}
                InputLabelProps={{
                  shrink: router.query.id || watch("petName") ? true : false,
                }}
                helperText={error?.petName ? error.petName.message : null}
              />
            </div>
            <div className={styles.row}>
              <div>
                <UploadButton
                  appName="VMS"
                  serviceName="PetLicense"
                  // @ts-ignore
                  label={<FormattedLabel id="animalPhotoOne" />}
                  filePath={animalPhotoOne}
                  fileUpdater={setAnimalPhotoOne}
                  view={!!router.query.id}
                  onlyImage
                  readOnly={!!router.query.id}
                />
                <label style={{ color: "red" }}>
                  <FormattedLabel id="imageOnly" />
                </label>
              </div>
              <div>
                <UploadButton
                  appName="VMS"
                  serviceName="PetLicense"
                  // @ts-ignore
                  label={<FormattedLabel id="animalPhotoTwo" />}
                  filePath={animalPhotoTwo}
                  fileUpdater={setAnimalPhotoTwo}
                  view={!!router.query.id}
                  onlyImage
                  readOnly={!!router.query.id}
                />
                <label style={{ color: "red" }}>
                  <FormattedLabel id="imageOnly" />
                </label>
              </div>
              <div>
                <UploadButton
                  appName="VMS"
                  serviceName="PetLicense"
                  // @ts-ignore
                  label={<FormattedLabel id="animalPhotoThree" />}
                  filePath={animalPhotoThree}
                  fileUpdater={setAnimalPhotoThree}
                  view={!!router.query.id}
                  onlyImage
                  readOnly={!!router.query.id}
                />
                <label style={{ color: "red" }}>
                  <FormattedLabel id="imageOnly" />
                </label>
              </div>
            </div>

            <>
              <div className={styles.subTitle}>
                <FormattedLabel id="payment" />
              </div>

              <div className={styles.row}>
                <FormControl
                  disabled={router.query.id ? true : false}
                  variant="standard"
                  error={!!error.paymentMode}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="paymentMode" />
                  </InputLabel>
                  {/* @ts-ignore */}
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: "250px" }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        // @ts-ignore
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="paymentMode"
                      >
                        <MenuItem key={1} value={"online"}>
                          Online
                        </MenuItem>
                        <MenuItem key={2} value={"cash"}>
                          Cash
                        </MenuItem>
                      </Select>
                    )}
                    name="paymentMode"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {error?.paymentMode ? error.paymentMode.message : null}
                  </FormHelperText>
                </FormControl>
                <TextField
                  disabled={!!router.query.id}
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="payerName" />}
                  // @ts-ignore
                  variant="standard"
                  {...register("payerName")}
                  error={!!error.payerName}
                  InputLabelProps={{
                    shrink: !!router.query.id || watch("payerName"),
                  }}
                  helperText={error?.payerName ? error.payerName.message : null}
                />
                <TextField
                  disabled={!!router.query.id}
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="payerAddress" />}
                  // @ts-ignore
                  variant="standard"
                  {...register("payerAddress")}
                  error={!!error.payerAddress}
                  InputLabelProps={{
                    shrink: !!router.query.id || watch("payerAddress"),
                  }}
                  helperText={
                    error?.payerAddress ? error.payerAddress.message : null
                  }
                />
              </div>
              <div className={styles.row}>
                <FormControl
                  disabled={!!router.query.id}
                  error={!!error.receiptDate}
                >
                  {/* @ts-ignore */}
                  <Controller
                    control={control}
                    name="receiptDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          // disabled={router.query.id ? true : false}
                          disabled
                          inputFormat="dd/MM/yyyy"
                          label={<FormattedLabel id="receiptDate" />}
                          // @ts-ignore
                          value={field.value}
                          // value={router.query.id ? field.value : new Date()}
                          onChange={(date) =>
                            field.onChange(moment(date).format("YYYY-MM-DD"))
                          }
                          renderInput={(params) => (
                            <TextField
                              sx={{ width: "250px" }}
                              {...params}
                              size="small"
                              fullWidth
                              variant="standard"
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>
                    {error?.receiptDate ? error.receiptDate.message : null}
                  </FormHelperText>
                </FormControl>
                <TextField
                  disabled={!!router.query.id}
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="narration" />}
                  // @ts-ignore
                  variant="standard"
                  {...register("narration")}
                  error={!!error.narration}
                  InputLabelProps={{
                    shrink: !!router.query.id || watch("narration"),
                  }}
                  helperText={error?.narration ? error.narration.message : null}
                />
                <TextField
                  disabled
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="amount" />}
                  value={20}
                  // @ts-ignore
                  variant="standard"
                  {...register("amount")}
                  error={!!error.amount}
                  InputLabelProps={{
                    shrink: router.query.id || watch("amount") ? true : false,
                  }}
                  helperText={error?.amount ? error.amount.message : null}
                />
              </div>
            </>
            <div className={styles.paymentTable}>
              <label className={styles.bold}>
                <FormattedLabel id="paymentTable" />
              </label>
              <DataGrid
                autoHeight
                sx={{
                  marginTop: "2vh",
                  width: "70%",

                  "& .cellColor": {
                    backgroundColor: "#1976d2",
                    color: "white",
                  },
                }}
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 0 },
                    disableExport: false,
                    disableToolbarButton: false,
                    csvOptions: { disableToolbarButton: false },
                    printOptions: { disableToolbarButton: true },
                  },
                }}
                rows={paymentTable}
                //@ts-ignore
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                experimentalFeatures={{ newEditingApi: true }}
                loading={loader}
              />
            </div>

            <div className={styles.buttons}>
              {
                // @ts-ignore
                (allData.status == "Awaiting Payment" ||
                  // @ts-ignore
                  allData.status == "Payment Successful") && (
                  <Button
                    variant="contained"
                    endIcon={<Description />}
                    onClick={() => {
                      router.push({
                        pathname: `/veterinaryManagementSystem/transactions/prescription`,
                        query: { id: router.query.id, service: "opd" },
                      });
                    }}
                  >
                    <FormattedLabel id="prescription" />
                  </Button>
                )
              }

              {!router.query.id && (
                <Button
                  variant="contained"
                  type="submit"
                  color="success"
                  endIcon={<Save />}
                >
                  <FormattedLabel id="save" />
                </Button>
              )}

              {router.query.id && (
                <Button
                  variant="contained"
                  endIcon={<Description />}
                  onClick={() => {
                    router.push({
                      pathname:
                        "/veterinaryManagementSystem/transactions/casePaperReceipt",
                      // query: { id: router.query.id, service: 'opd' },
                      query: { id: router.query.id },
                    });
                  }}
                >
                  <FormattedLabel id="casePaperReceipt" />
                </Button>
              )}

              {
                // @ts-ignore
                allData.status === "Awaiting Payment" && (
                  <Button
                    variant="contained"
                    onClick={payment}
                    endIcon={<Payment />}
                  >
                    <FormattedLabel id="makePayment" />
                  </Button>
                )
              }
              {/* <Button variant="outlined" color="error" endIcon={<Clear />}>
              <FormattedLabel id="clear" />
            </Button> */}
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  router.push(
                    `/veterinaryManagementSystem/transactions/opd/clerk`
                  );
                }}
                endIcon={<ExitToApp />}
              >
                <FormattedLabel id="exit" />
              </Button>
            </div>
          </form>
        </FormProvider>
      </Paper>
    </>
  );
};

export default Index;
