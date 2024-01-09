import styles from "../vet.module.css";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import router from "next/router";
import URLs from "../../../../../URLS/urls";

import Paper from "@mui/material/Paper";
import {
  Button,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Autocomplete,
} from "@mui/material";
import {
  Clear,
  ExitToApp,
  Payment,
  Pets,
  Save,
  Search,
} from "@mui/icons-material";
import FormControl from "@mui/material/FormControl";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import UploadButton from "../../../../../containers/reuseableComponents/UploadButton";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import axios from "axios";
import sweetAlert from "sweetalert";
import { useSelector } from "react-redux";
import { sortByAsc } from "../../../../../containers/reuseableComponents/Sorter";
import Breadcrumb from "../../../../../components/common/BreadcrumbComponent";
import Title from "../../../../../containers/VMS_ReusableComponents/Title";
import Loader from "../../../../../containers/Layout/components/Loader";
import Transliteration from "../../../../../components/common/linguosol/transliteration";
import {
  useGetToken,
  useApplicantType,
} from "../../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../../util/util";

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);
  const userToken = useGetToken();
  const applicantType = useApplicantType();

  // @ts-ignore
  const userId = useSelector((state) => state.user.user.id);
  const isDeptUser = useSelector(
    // @ts-ignore
    (state) => state?.user?.user?.userDao?.deptUser
  );

  const [dataFetched, setDataFetched] = useState(false);
  const [enableState, setEnableState] = useState(false);
  const [loader, setLoader] = useState(false);

  const [vaccinationPdf, setvaccinationPdf] = useState("");
  const [petAnimalPhoto, setpetAnimalPhoto] = useState("");
  const [ownerPhotoId, setOwnerPhotoID] = useState("");
  const [oldLicence, setOldLicence] = useState("");
  const [addressProof, setAddressProof] = useState("");

  const [applicationDetails, setApplicationDetails] = useState({});
  const [areaDropDown, setAreaDropDown] = useState([]);
  const [zoneDropDown, setZoneDropDown] = useState([]);
  const [wardDropDown, setWardDropDown] = useState([]);

  const [petAnimal, setPetAnimal] = useState([]);
  const [petBreeds, setPetBreeds] = useState([]);
  const [maxBdate, setMaxBdate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );

  let petSchema = yup.object().shape({
    firstName: yup
      .string()
      .required(
        language === "en"
          ? "Please enter first name in english"
          : "कृपया इंग्रजीमध्ये प्रथम नाव प्रविष्ट करा"
      )
      .matches(
        /^[A-Za-z\u0900-\u097F\s]+$/,
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
        /^[A-Za-z\u0900-\u097F\s]+$/,
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
        /^[A-Za-z\u0900-\u097F\s]+$/,
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
        /^[A-Za-z\u0900-\u097F\s]+$/,
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
        /^[A-Za-z\u0900-\u097F\s]+$/,
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
        /^[A-Za-z\u0900-\u097F\s]+$/,
        language === "en"
          ? "Must be only english or marathi characters"
          : "फक्त इंग्लिश किंवा मराठी शब्द "
      ),

    petAnimalKey: yup
      .number()
      .required(
        language === "en" ? "Please select an animal" : "कृपया एक प्राणी निवडा"
      )
      .typeError(
        language === "en" ? "Please select an animal" : "कृपया एक प्राणी निवडा"
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
        language === "en" ? "Please select a area" : "कृपया क्षेत्र निवडा"
      )
      .typeError(
        language === "en" ? "Please select a area" : "कृपया क्षेत्र निवडा"
      ),
    // lattitude: yup.string().required('Please enter lattitude'),
    // longitude: yup.string().required('Please enter longitude'),
    cityName: yup
      .string()
      .required(language === "en" ? "Please select a city" : "कृपया शहर निवडा")
      .typeError(
        language === "en" ? "Please select an animal" : "कृपया एक प्राणी निवडा"
      ),
    pincode: yup
      .string()
      .required(
        language === "en"
          ? "Please enter a pincode"
          : "कृपया पिनकोड प्रविष्ट करा"
      )
      // .matches(/^[0-9]+$/, 'Must be only digits')
      .matches(
        /^[1-9][0-9]*[1-9]$/,
        language === "en" ? "Invalid pincode" : "अवैध पिनकोड"
      )
      .min(
        6,
        language === "en"
          ? "Pincode Number must be at least 6 number"
          : "पिनकोड क्रमांक किमान 6 क्रमांकाचा असावा"
      )
      .max(
        6,
        language === "en"
          ? "Pincode Number not valid on above 6 number"
          : "6 वरील क्रमांकावर पिनकोड क्रमांक वैध नाही"
      ),
    addrFlatOrHouseNo: yup
      .string()
      .required(
        language === "en"
          ? "Please enter flat or house no."
          : "कृपया फ्लॅट किंवा घर क्रमांक प्रविष्ट करा"
      )
      .matches(
        /^[A-Za-z0-9०-९\u0900-\u097F\s /.,-]+$/,
        language === "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द"
      ),
    addrBuildingName: yup
      .string()
      .required(
        language === "en"
          ? "Please enter building name"
          : "कृपया इमारतीचे नाव प्रविष्ट करा"
      )
      .matches(
        /^[A-Za-z\u0900-\u097F\s /.,-]+$/,
        language === "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द"
      ),
    detailAddress: yup
      .string()
      .required(
        language === "en"
          ? "Please enter detail address"
          : "कृपया तपशीलवार पत्ता प्रविष्ट करा"
      )
      .matches(
        /^[A-Za-z0-9०-९\u0900-\u097F\s /.,-]+$/,
        language === "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द"
      ),
    // ownerName: yup
    //   .string()
    //   .required("Please enter owner name")
    //   .matches(
    //     /^[A-Za-z0-9@-\s]+$/,
    //     language === "en"
    //       ? "Must be only english characters"
    //       : "फक्त इंग्लिश शब्द "
    //   ),
    ownerMobileNo: yup
      .string()
      // .matches(/^[0-9]*$/, 'Must be only digits')
      .matches(
        /^[6-9][0-9]+$/,
        language === "en" ? "Invalid mobile no." : "अवैध मोबाईल नंबर."
      )
      .required(
        language === "en" ? "Please enter mobile no." : "कृपया मोबाईल नंबर टाका"
      )
      .typeError(
        language === "en" ? "Please enter mobile no." : "कृपया मोबाईल नंबर टाका"
      )
      .min(
        10,
        language === "en"
          ? "Mobile no. shouldn't be less than 10 digits"
          : "मोबाईल नंबर 10 अंकांपेक्षा कमी नसावा"
      )
      .max(
        10,
        language === "en"
          ? "Mobile no. shouldn't be greater than 10 digits"
          : "मोबाईल नंबर 10 अंकांपेक्षा जास्त नसावा"
      ),
    ownerEmailId: yup
      .string()
      .required(
        language === "en" ? "Please enter email id" : "कृपया ईमेल आयडी टाका"
      )
      .email(language === "en" ? "Incorrect format" : "चुकीचे स्वरूप"),
    petName: yup
      .string()
      .required(
        language === "en"
          ? "Please enter pet name"
          : "कृपया पाळीव प्राण्याचे नाव प्रविष्ट करा"
      )
      .matches(
        /^[A-Za-z0-9@-\s]+$/,
        language === "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द"
      ),
    petBirthdate: yup
      .date()
      .typeError(
        language === "en"
          ? `Please select pet's birthdate`
          : `कृपया पाळीव प्राण्याची जन्मतारीख निवडा`
      )
      .required(
        language === "en"
          ? `Please select pet's birthdate`
          : `कृपया पाळीव प्राण्याची जन्मतारीख निवडा`
      ),
    animalBreedKey: yup
      .number()
      .required(
        language === "en"
          ? "Please select an animal breed"
          : "कृपया जनावरांची जात निवडा"
      )
      .typeError(
        language === "en"
          ? "Please select an animal breed"
          : "कृपया जनावरांची जात निवडा"
      ),
    animalColor: yup
      .string()
      .required(
        language === "en"
          ? "Please enter color of the animal"
          : "कृपया प्राण्याचा रंग प्रविष्ट करा"
      )
      .matches(
        /^[A-Za-z\s]+$/,
        language === "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द"
      ),
    // animalAge: yup.number().required("Please enter the age of animal (in years)"),
    animalWeight: yup
      .number()
      .required(
        language === "en"
          ? "Please enter the weight of animal (in kg)"
          : "कृपया प्राण्याचे वजन प्रविष्ट करा (किलोमध्ये)"
      )
      .typeError(
        language === "en"
          ? "Please enter the weight of animal (in kg)"
          : "कृपया प्राण्याचे वजन प्रविष्ट करा (किलोमध्ये)"
      ),
    animalGender: yup
      .string()
      .required(
        language === "en"
          ? "Please select the gender of the animal"
          : "कृपया प्राण्याचे लिंग निवडा"
      ),
    antiRabiesVaccinationStatus: yup
      .string()
      .required(
        language === "en"
          ? "Please select whether the animal is vaccinated"
          : "कृपया प्राण्याला लसीकरण केले आहे की नाही ते निवडा"
      ),
    vaccinationDate: yup
      .date()
      .typeError(
        language === "en"
          ? "Please select date of vaccination"
          : "कृपया लसीकरणाची तारीख निवडा"
      )
      .required(
        language === "en"
          ? "Please select date of vaccination"
          : "कृपया लसीकरणाची तारीख निवडा"
      ),
    vetDocName: yup
      .string()
      .required(
        language === "en"
          ? `Please enter vet's name`
          : "कृपया पशुवैद्याचे नाव प्रविष्ट करा"
      )
      .matches(
        /^[A-Za-z0-9०-९\u0900-\u097F\s .]+$/,
        language === "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द"
      ),
  });

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(petSchema),
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
    setValue("antiRabiesVaccinationStatus", "y");

    if (
      petAnimalPhoto !== "" &&
      vaccinationPdf !== "" &&
      ownerPhotoId !== "" &&
      oldLicence !== "" &&
      addressProof !== ""
    ) {
      setEnableState(true);
    } else {
      setEnableState(false);
    }
  }, [petAnimalPhoto, vaccinationPdf, ownerPhotoId, oldLicence, addressProof]);

  useEffect(() => {
    setValue("petAnimalKey", router.query.petAnimal);

    let currentDate = new Date();

    setMaxBdate(
      Number(moment(currentDate).format("MM")) - 3 >= 0
        ? moment(currentDate).format("YYYY") +
            "-" +
            (Number(moment(currentDate).format("MM")) - 3) +
            "-" +
            moment(currentDate).format("DD")
        : Number(moment(currentDate).format("YYYY")) -
            1 +
            "-" +
            (Number(moment(currentDate).format("MM")) - 3 + 12) +
            +"-" +
            moment(currentDate).format("DD")
    );

    //Get Area
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

    // Get Zone
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

    !router.query.id && getZones();

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
        setPetAnimal(
          res.data.mstPetAnimalList.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            nameEn: j.nameEn,
            nameMr: j.nameMr,
          }))
        );
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
        .get(`${URLs.VMS}/trnRenewalPetLicence/getById`, {
          params: { id: router.query?.id },
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setApplicationDetails({ ...res.data });
          reset({ ...res.data });
          if (res.data.antiRabiesVaccinationStatus === "y") {
            setValue(
              "antiRabiesVaccinationStatus",
              res.data.antiRabiesVaccinationStatus
            );
            setvaccinationPdf(res.data.vaccinationPdf);
          }
          setpetAnimalPhoto(res.data.petAnimalPhoto);
          setOwnerPhotoID(res.data.ownerPhotoId);
          setOldLicence(res.data.oldLicence);
          setAddressProof(res.data.addressProof);
          setDataFetched(true);

          setLoader(false);
        })
        .catch((error) => {
          console.log("error: ", error);
          catchExceptionHandlingMethod(error, language);
          setLoader(false);
        });
    }
  }, []);

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
    setLoader(true);
    axios
      .get(
        `${URLs.CFCURL}/master/zoneWardAreaMapping/getWardByZoneAndModuleId`,
        {
          params: { zoneId },
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        setWardDropDown(
          res.data.map((wards) => ({
            id: wards.wardId,
            wardEn: wards.wardName,
            wardMr: wards.wardNameMr,
          }))
        );
        setLoader(false);
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language);

        setLoader(false);
      });
  };

  const getAreas = (zoneId, wardId) => {
    setLoader(true);
    axios
      .get(
        `${URLs.CFCURL}/master/zoneWardAreaMapping/getAreaByZoneAndWardAndModuleId`,
        {
          params: { zoneId, wardId },
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
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
          }))
        );
        setLoader(false);
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language);

        setLoader(false);
      });
  };

  const clearFields = () => {
    reset({
      petAnimalKey: router.query.petAnimal,
      lattitude: "",
      longitude: "",
      pincode: "",
      areaKey: "",
      addrFlatOrHouseNo: "",
      addrBuildingName: "",
      detailAddress: "",
      // ownerName: '',
      firstName: "",
      middleName: "",
      lastName: "",
      firstNameMr: "",
      middleNameMr: "",
      lastNameMr: "",
      ownerMobileNo: "",
      ownerEmailId: "",
      petName: watch("petName"),
      petBirthdate: watch("petBirthdate"),
      animalColor: watch("animalColor"),
      // animalAge: "",
      animalWeight: "",
      antiRabiesVaccinationStatus: "y",
      vaccinationDate: null,
      vetDocName: "",
      cityName: "",
      zoneKey: "",
      wardKey: "",
      stateName: "Maharashtra",
    });

    setOwnerPhotoID("");
    setpetAnimalPhoto("");
    setvaccinationPdf("");
    setAddressProof("");
  };

  const payment = () => {
    router.push({
      pathname: `/veterinaryManagementSystem/transactions/renewalPetLicense/paymentGateway`,
      query: { id: router.query.id, amount: 50, serviceId: 115 },
    });
  };

  function calcAge(dob) {
    var properBday = "";

    if (
      Number(new Date().getFullYear) % 4 === 0 &&
      (Number(new Date().getFullYear) % 100 !== 0 ||
        Number(new Date().getFullYear) % 400 === 0)
    ) {
      const newDate =
        Number(moment(dob).format("DD")) - 1 > 0
          ? Number(moment(dob).format("DD")) - 1
          : Number(moment(dob).format("DD"));
      properBday = moment(dob).format("YYYY-MM-") + newDate;
    } else {
      const newDate =
        Number(moment(dob).format("DD")) - 2 > 0
          ? Number(moment(dob).format("DD")) - 2
          : Number(moment(dob).format("DD"));
      properBday = moment(dob).format("YYYY-MM-") + newDate;
    }

    const duration = moment.duration(
      moment(new Date()).diff(moment(properBday))
    );

    let years = duration.years();
    let months = duration.months();

    months = months >= 10 ? months : "0" + months;
    years = years >= 10 ? years : "0" + years;
    months == 0
      ? setValue("animalAge", years)
      : setValue("animalAge", years + ":" + months);
  }

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
        console.table(res.data);
        if (res.data.petAnimalKey != router.query.petAnimal) {
          sweetAlert({
            title: language === "en" ? "Incorrect Animal" : "चुकीचा प्राणी",
            text:
              language === "en"
                ? "Animal selected doesnt match with the licensed pet animal"
                : "निवडलेला प्राणी परवानाधारक पाळीव प्राण्याशी जुळत नाही",
            icon: "warning",
            buttons: [
              language === "en" ? "Cancel" : "रद्द करा",
              language === "en" ? "Ok" : "ठीक आहे",
            ],
          }).then(() => {
            router.push(
              `/veterinaryManagementSystem/transactions/renewalPetLicense/TnC`
            );
          });
        } else {
          const {
            paymentKey,
            applicationNumber,
            applicationDate,
            applicationStatus,
            licenseStartDate,
            licenseEndDate,
            ...rest
          } = res.data;
          reset({ ...rest });
          setValue("licenseNo", res.data.petLicenceNo);
          setValue("stateName", "Maharashtra");
          calcAge(res.data.petBirthdate);
          res.data.vaccinationPdf && setvaccinationPdf(res.data.vaccinationPdf);
          setpetAnimalPhoto(res.data.petAnimalPhoto);
          setOwnerPhotoID(res.data.ownerPhotoId);
          setOldLicence(res.data.oldLicence ?? "");
          setAddressProof(res.data?.addressProof);

          !router.query.id && getWards(res?.data?.zoneKey);
          !router.query.id && getAreas(res?.data?.zoneKey, res?.data?.wardKey);

          setDataFetched(true);
        }
      })
      .catch((error) => {
        if (error.response.status == 401) {
          catchExceptionHandlingMethod(error, language);
        } else {
          sweetAlert({
            title:
              language === "en"
                ? "Incorrect License No."
                : "चुकीचा परवाना क्रमांक",
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

  const finalSubmit = (data) => {
    const { id, ...rest } = data;

    sweetAlert({
      title: language === "en" ? "Confirmation" : "पुष्टीकरण",
      text:
        language === "en"
          ? "Are you sure you want to submit the application ?"
          : "अर्ज सबमिट करू इच्छिता?",
      icon: "warning",
      buttons: [
        language === "en" ? "Cancel" : "रद्द करा",
        language === "en" ? "Save" : "जतन करा",
      ],
    }).then((ok) => {
      if (ok) {
        setLoader(true);
        const bodyForAPI = {
          ...rest,
          trnPetLicenceKey: id,
          createdUserId: userId,
          serviceId: 115,
          vaccinationPdf,
          petAnimalPhoto,
          ownerPhotoId,
          oldLicence,
          addressProof,
          status: "Applied",
          scrutinyRemark: "Pending",
          id: router.query.id ?? null,
          applicantType,
        };

        axios
          .post(`${URLs.VMS}/trnRenewalPetLicence/save`, bodyForAPI, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((res) => {
            if (res.status === 200 || res.status === 201) {
              sweetAlert(
                language === "en" ? "Success" : "यशस्वी झाले",
                language === "en"
                  ? "Application saved successfully!"
                  : "तुमचा अर्ज यशस्वीरित्या सेव्ह झाला!",
                "success",
                { button: language === "en" ? "Ok" : "ठीक आहे" }
              );

              isDeptUser
                ? router.push(
                    `/veterinaryManagementSystem/transactions/renewalPetLicense/application`
                  )
                : router.push(`/dashboard`);
            }
            clearFields();
            setLoader(false);
          })
          .catch((error) => {
            console.log("error: ", error);
            catchExceptionHandlingMethod(error, language);

            setLoader(false);
          });
      }
    });
  };

  return (
    <>
      <Head>
        <title>Pet License Renewal</title>
      </Head>
      <Breadcrumb />

      <Paper className={styles.main}>
        {loader && <Loader />}
        <Title titleLabel={<FormattedLabel id="renewalPetLicense" />} />
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(finalSubmit)}
            style={{ padding: "5vh 3%" }}
          >
            <div
              className={styles.wrapped}
              style={{
                justifyContent: dataFetched ? "space-between" : "center",
              }}
            >
              {dataFetched && (
                <FormControl
                  disabled
                  variant="standard"
                  error={!!error.petAnimalKey}
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
                        // @ts-ignore
                        value={
                          router.query.petAnimal ||
                          // @ts-ignore
                          applicationDetails?.petAnimalKey
                        }
                        onChange={(value) => field.onChange(value)}
                        label="petAnimalKey"
                      >
                        {petAnimal &&
                          petAnimal.map((obj) => (
                            <MenuItem key={1} value={obj?.id}>
                              {language === "en" ? obj?.nameEn : obj?.nameMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="petAnimalKey"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {error?.petAnimalKey ? error.petAnimalKey.message : null}
                  </FormHelperText>
                </FormControl>
              )}

              <TextField
                // disabled={!!router.query.id || dataFetched}
                disabled={!!router.query.id}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="licenseNo" required />}
                placeholder="For eg.: DG/2024/0000001"
                variant="standard"
                {...register("licenseNo")}
                onChange={(e) => {
                  setValue("licenseNo", e.target.value.toUpperCase());
                }}
                InputLabelProps={{
                  // shrink: router.query.id || watch("licenseNo"),
                  shrink: true,
                }}
                error={!!error.licenseNo}
                helperText={error?.licenseNo ? error.licenseNo.message : null}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        // disabled={!!router.query.id || dataFetched}
                        disabled={!!router.query.id}
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
              {dataFetched && (
                <>
                  <div style={{ width: 250 }}></div>
                  <div style={{ width: 250 }}></div>
                  <div style={{ width: 250 }}></div>
                  <div style={{ width: 250 }}></div>
                  <div style={{ width: 250 }}></div>
                  <div style={{ width: 250 }}></div>
                </>
              )}
            </div>
            {dataFetched && (
              <>
                <div className={styles.wrapped}>
                  {/* <TextField
                  disabled={router.query.pageMode == "view"}
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="fNameEn" required />}
                  InputLabelProps={{
                    shrink: router.query.id || watch("firstName"),
                  }}
                  variant="standard"
                  {...register("firstName")}
                  error={!!error.firstName}
                  helperText={error?.firstName ? error.firstName.message : null}
                />
                <TextField
                  disabled={router.query.pageMode == "view"}
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="mNameEn" required />}
                  InputLabelProps={{
                    shrink: router.query.id || watch("middleName"),
                  }}
                  variant="standard"
                  {...register("middleName")}
                  error={!!error.middleName}
                  helperText={
                    error?.middleName ? error.middleName.message : null
                  }
                />
                <TextField
                  disabled={router.query.pageMode == "view"}
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="lNameEn" required />}
                  InputLabelProps={{
                    shrink: router.query.id || watch("lastName"),
                  }}
                  variant="standard"
                  {...register("lastName")}
                  error={!!error.lastName}
                  helperText={error?.lastName ? error.lastName.message : null}
                /> */}

                  <div style={{ width: 250 }}>
                    <Transliteration
                      disabled={router.query.pageMode == "view"}
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
                      helperText={
                        error?.firstName ? error.firstName.message : null
                      }
                    />
                  </div>
                  <div style={{ width: 250 }}>
                    <Transliteration
                      disabled={router.query.pageMode == "view"}
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
                    />
                  </div>
                  <div style={{ width: 250 }}>
                    <Transliteration
                      disabled={router.query.pageMode == "view"}
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
                      helperText={
                        error?.lastName ? error.lastName.message : null
                      }
                    />
                  </div>
                  <TextField
                    disabled={router.query.pageMode == "view"}
                    sx={{ width: "250px" }}
                    label={<FormattedLabel id="fNameMr" required />}
                    InputLabelProps={{
                      shrink: router.query.id || watch("firstNameMr"),
                    }}
                    variant="standard"
                    {...register("firstNameMr")}
                    error={!!error.firstNameMr}
                    helperText={
                      error?.firstNameMr ? error.firstNameMr.message : null
                    }
                  />
                  <TextField
                    disabled={router.query.pageMode == "view"}
                    sx={{ width: "250px" }}
                    label={<FormattedLabel id="mNameMr" required />}
                    InputLabelProps={{
                      shrink: router.query.id || watch("middleNameMr"),
                    }}
                    variant="standard"
                    {...register("middleNameMr")}
                    error={!!error.middleNameMr}
                    helperText={
                      error?.middleNameMr ? error.middleNameMr.message : null
                    }
                  />
                  <TextField
                    disabled={router.query.pageMode == "view"}
                    sx={{ width: "250px" }}
                    label={<FormattedLabel id="lNameMr" required />}
                    InputLabelProps={{
                      shrink: router.query.id || watch("lastNameMr"),
                    }}
                    variant="standard"
                    {...register("lastNameMr")}
                    error={!!error.lastNameMr}
                    helperText={
                      error?.lastNameMr ? error.lastNameMr.message : null
                    }
                  />

                  <TextField
                    sx={{ width: "250px" }}
                    label={<FormattedLabel id="mobileNo" required />}
                    disabled={router.query.pageMode == "view"}
                    // @ts-ignore
                    // value={router.query.id && applicationDetails.ownerMobileNo}
                    InputLabelProps={{
                      shrink: router.query.id || watch("ownerMobileNo"),
                    }}
                    inputProps={{ maxLength: 10 }}
                    variant="standard"
                    {...register("ownerMobileNo")}
                    error={!!error.ownerMobileNo}
                    helperText={
                      error?.ownerMobileNo ? error.ownerMobileNo.message : null
                    }
                  />
                  <TextField
                    sx={{ width: "250px" }}
                    label={<FormattedLabel id="emailId" required />}
                    disabled={router.query.pageMode == "view"}
                    // @ts-ignore
                    // value={router.query.id && applicationDetails.ownerEmailId}
                    InputLabelProps={{
                      shrink: router.query.id || watch("ownerEmailId"),
                    }}
                    variant="standard"
                    {...register("ownerEmailId")}
                    error={!!error.ownerEmailId}
                    helperText={
                      error?.ownerEmailId ? error.ownerEmailId.message : null
                    }
                  />

                  <TextField
                    disabled={router.query.pageMode == "view"}
                    sx={{ width: "250px" }}
                    label={<FormattedLabel id="flatOrHouseNo" required />}
                    id="addrFlatOrHouseNo"
                    variant="standard"
                    {...register("addrFlatOrHouseNo")}
                    error={!!error.addrFlatOrHouseNo}
                    InputLabelProps={{
                      shrink: router.query.id || watch("addrFlatOrHouseNo"),
                    }}
                    helperText={
                      error?.addrFlatOrHouseNo
                        ? error.addrFlatOrHouseNo.message
                        : null
                    }
                  />

                  <TextField
                    sx={{ width: "250px" }}
                    label={<FormattedLabel id="buildingName" required />}
                    disabled={router.query.pageMode == "view"}
                    variant="standard"
                    {...register("addrBuildingName")}
                    error={!!error.addrBuildingName}
                    InputLabelProps={{
                      shrink: router.query.id || watch("addrBuildingName"),
                    }}
                    helperText={
                      error?.addrBuildingName
                        ? error.addrBuildingName.message
                        : null
                    }
                  />
                  <TextField
                    sx={{ width: "250px" }}
                    label={<FormattedLabel id="detailAddress" required />}
                    disabled={router.query.pageMode == "view"}
                    variant="standard"
                    {...register("detailAddress")}
                    InputLabelProps={{
                      shrink: router.query.id || watch("detailAddress"),
                    }}
                    error={!!error.detailAddress}
                    helperText={
                      error?.detailAddress ? error.detailAddress.message : null
                    }
                  />

                  {/* <FormControl
                  disabled={router.query.pageMode == 'view'}
                  variant='standard'
                  error={!!error.cityName}
                >
                  <InputLabel id='demo-simple-select-standard-label'>
                    <FormattedLabel id='city' />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: '250px' }}
                        labelId='demo-simple-select-standard-label'
                        id='demo-simple-select-standard'
                        // @ts-ignore
                        value={applicationDetails.cityName ?? field.value}
                        onChange={(value) => field.onChange(value)}
                        label='cityName'
                      >
                        
                        <MenuItem key={1} value={'pimpriChinchwad'}>
                          {language === 'en'
                            ? 'Pimpri-Chinchwad'
                            : 'पिंपरी-चिंचवड'}
                        </MenuItem>
                      </Select>
                    )}
                    name='cityName'
                    control={control}
                    defaultValue=''
                  />
                  <FormHelperText>
                    {error?.cityName ? error.cityName.message : null}
                  </FormHelperText>
                </FormControl> */}
                  <FormControl error={!!error?.cityName}>
                    <Controller
                      name="cityName"
                      control={control}
                      defaultValue={null}
                      render={({ field: { onChange, value } }) => (
                        // render={({ field }) => (
                        <Autocomplete
                          variant="standard"
                          id="controllable-states-demo"
                          sx={{ width: 250 }}
                          onChange={(event, newValue) => {
                            onChange(newValue ? newValue.value : null);
                          }}
                          value={
                            [
                              {
                                value: "pimpriChinchwad",
                                nameEn: "Pimpri-Chinchwad",
                                nameMr: "पिंपरी-चिंचवड",
                              },
                            ]?.find((data) => data?.value == value) || null
                          }
                          options={[
                            {
                              value: "pimpriChinchwad",
                              nameEn: "Pimpri-Chinchwad",
                              nameMr: "पिंपरी-चिंचवड",
                            },
                          ]}
                          getOptionLabel={(cityName) =>
                            cityName[language == "en" ? "nameEn" : "nameMr"]
                          }
                          renderInput={(params) => (
                            <TextField
                              fullWidth
                              {...params}
                              label={<FormattedLabel id="city" required />}
                              variant="standard"
                              error={!!error.cityName}
                            />
                          )}
                          disabled={!!router.query.id}
                        />
                      )}
                    />
                    <FormHelperText>
                      {error?.cityName ? error?.cityName?.message : null}
                    </FormHelperText>
                  </FormControl>
                  <TextField
                    disabled
                    sx={{ width: "250px" }}
                    label={<FormattedLabel id="state" />}
                    // @ts-ignore
                    // value={"Maharashtra"}
                    variant="standard"
                    {...register("stateName")}
                    InputLabelProps={{
                      shrink: watch("stateName"),
                    }}
                    error={!!error.stateName}
                    helperText={
                      error?.stateName ? error.stateName.message : null
                    }
                  />
                  <TextField
                    disabled={router.query.pageMode == "view"}
                    sx={{ width: "250px" }}
                    label={<FormattedLabel id="pincode" required />}
                    variant="standard"
                    {...register("pincode")}
                    InputLabelProps={{
                      shrink: router.query.id || watch("pincode"),
                    }}
                    inputProps={{ maxLength: 6 }}
                    error={!!error.pincode}
                    helperText={error?.pincode ? error.pincode.message : null}
                  />

                  {/* <FormControl
                  disabled={router.query.pageMode == 'view'}
                  variant='standard'
                  error={!!error.areaKey}
                >
                  <InputLabel id='demo-simple-select-standard-label'>
                    <FormattedLabel id='area' />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: '250px' }}
                        labelId='demo-simple-select-standard-label'
                        id='demo-simple-select-standard'
                        // @ts-ignore
                        // value={applicationDetails.areaKey ?? field.value}
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value)
                          let tempObjForZoneAndWard = areaDropDown?.find(
                            (j) => j.area == value.target.value
                          )
                          getWards(tempObjForZoneAndWard?.zone)
                          setValue('zoneKey', tempObjForZoneAndWard?.zone)
                          setValue('wardKey', tempObjForZoneAndWard?.ward)
                        }}
                        label='areaKey'
                      >
                        {areaDropDown &&
                          areaDropDown.map((value, index) => (
                            <MenuItem
                              key={index}
                              value={
                                //@ts-ignore
                                // value.id
                                value?.area
                              }
                            >
                              {language == 'en'
                                ? //@ts-ignore
                                  value.areaDisplayNameEn
                                : // @ts-ignore
                                  value?.areaDisplayNameMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name='areaKey'
                    control={control}
                    defaultValue=''
                  />
                  <FormHelperText>
                    {error?.areaKey ? error.areaKey.message : null}
                  </FormHelperText>
                </FormControl> */}
                  <FormControl error={!!error?.areaKey}>
                    <Controller
                      name="areaKey"
                      control={control}
                      defaultValue={null}
                      render={({ field: { onChange, value } }) => (
                        // render={({ field }) => (
                        <Autocomplete
                          variant="standard"
                          id="controllable-states-demo"
                          sx={{ width: 250 }}
                          onChange={(event, newValue) => {
                            onChange(newValue ? newValue?.area : null);
                            if (newValue?.area) {
                              let tempObjForZoneAndWard = areaDropDown?.find(
                                // (j) => j?.area == value.target.value
                                (j) => j?.area == newValue?.area
                              );
                              getWards(tempObjForZoneAndWard?.zone);
                              setValue("zoneKey", tempObjForZoneAndWard?.zone);
                              setValue("wardKey", tempObjForZoneAndWard?.ward);
                            } else {
                              setValue("zoneKey", null);
                              setValue("wardKey", null);
                            }
                          }}
                          value={
                            areaDropDown?.find((data) => data?.area == value) ||
                            null
                          }
                          options={areaDropDown}
                          getOptionLabel={(areaObj) =>
                            areaObj[
                              language == "en"
                                ? "areaDisplayNameEn"
                                : "areaDisplayNameMr"
                            ]
                          }
                          renderInput={(params) => (
                            <TextField
                              fullWidth
                              {...params}
                              label={<FormattedLabel id="area" required />}
                              variant="standard"
                              error={!!error.areaKey}
                            />
                          )}
                          disabled={!!router.query.id}
                        />
                      )}
                    />
                    <FormHelperText>
                      {error?.areaKey ? error?.areaKey?.message : null}
                    </FormHelperText>
                  </FormControl>
                  {/* <FormControl
                  disabled={router.query.pageMode == 'view'}
                  variant='standard'
                  error={!!error.zoneKey}
                >
                  <InputLabel id='demo-simple-select-standard-label'>
                    <FormattedLabel id='zone' />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: '250px' }}
                        labelId='demo-simple-select-standard-label'
                        id='demo-simple-select-standard'
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value)
                          !router.query.id && getWards(value.target.value)
                          !router.query.id && setValue('wardKey', '')
                          !router.query.id && setValue('areaKey', '')
                        }}
                        label='zoneKey'
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
                              {language == 'en'
                                ? //@ts-ignore
                                  value.zoneEn
                                : // @ts-ignore
                                  value?.zoneMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name='zoneKey'
                    control={control}
                    defaultValue=''
                  />
                  <FormHelperText>
                    {error?.zoneKey ? error.zoneKey.message : null}
                  </FormHelperText>
                </FormControl> */}

                  <FormControl error={!!error?.zoneKey}>
                    <Controller
                      name="zoneKey"
                      control={control}
                      defaultValue={null}
                      render={({ field: { onChange, value } }) => (
                        // render={({ field }) => (
                        <Autocomplete
                          variant="standard"
                          id="controllable-states-demo"
                          sx={{ width: 250 }}
                          onChange={(event, newValue) => {
                            onChange(newValue ? newValue?.id : null);
                            if (newValue?.id) {
                              !router.query.id && getWards(newValue?.id);
                              !router.query.id && setValue("wardKey", null);
                              !router.query.id && setValue("areaKey", null);
                            }
                          }}
                          value={
                            zoneDropDown?.find((data) => data?.id == value) ||
                            null
                          }
                          options={zoneDropDown}
                          getOptionLabel={(obj) =>
                            obj[language == "en" ? "zoneEn" : "zoneMr"]
                          }
                          renderInput={(params) => (
                            <TextField
                              fullWidth
                              {...params}
                              label={<FormattedLabel id="zone" required />}
                              variant="standard"
                              error={!!error.zoneKey}
                            />
                          )}
                          disabled={!!router.query.id}
                        />
                      )}
                    />
                    <FormHelperText>
                      {error?.zoneKey ? error?.zoneKey?.message : null}
                    </FormHelperText>
                  </FormControl>
                  {/* <FormControl
                  disabled={router.query.pageMode == 'view'}
                  variant='standard'
                  error={!!error.wardKey}
                >
                  <InputLabel id='demo-simple-select-standard-label'>
                    <FormattedLabel id='ward' />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: '250px' }}
                        labelId='demo-simple-select-standard-label'
                        id='demo-simple-select-standard'
                        // @ts-ignore
                        // value={applicationDetails.wardKey ?? field.value}
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value)
                          !router.query.id &&
                            getAreas(watch('zoneKey'), value.target.value)
                        }}
                        label='wardKey'
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
                              {language == 'en'
                                ? //@ts-ignore
                                  value.wardEn
                                : // @ts-ignore
                                  value?.wardMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name='wardKey'
                    control={control}
                    defaultValue=''
                  />
                  <FormHelperText>
                    {error?.wardKey ? error.wardKey.message : null}
                  </FormHelperText>
                </FormControl> */}
                  <FormControl error={!!error?.wardKey}>
                    <Controller
                      name="wardKey"
                      control={control}
                      defaultValue={null}
                      render={({ field: { onChange, value } }) => (
                        // render={({ field }) => (
                        <Autocomplete
                          variant="standard"
                          id="controllable-states-demo"
                          sx={{ width: 250 }}
                          onChange={(event, newValue) => {
                            onChange(newValue ? newValue?.id : null);
                            if (newValue?.id) {
                              !router.query.id &&
                                getAreas(watch("zoneKey"), newValue?.id);
                            }
                          }}
                          value={
                            wardDropDown?.find((data) => data?.id == value) ||
                            null
                          }
                          options={wardDropDown}
                          getOptionLabel={(obj) =>
                            obj[language == "en" ? "wardEn" : "wardMr"]
                          }
                          renderInput={(params) => (
                            <TextField
                              fullWidth
                              {...params}
                              label={<FormattedLabel id="ward" required />}
                              variant="standard"
                              error={!!error.wardKey}
                            />
                          )}
                          disabled={!!router.query.id}
                        />
                      )}
                    />
                    <FormHelperText>
                      {error?.wardKey ? error?.wardKey?.message : null}
                    </FormHelperText>
                  </FormControl>

                  {/* <TextField
                  sx={{ width: '250px' }}
                  label={<FormattedLabel id='ownerName' />}
                  disabled={router.query.pageMode == 'view'}
                  // @ts-ignore
                  // value={router.query.id && applicationDetails.ownerName}
                  InputLabelProps={{
                    shrink: router.query.id || watch('ownerName'),
                  }}
                  variant='standard'
                  {...register('ownerName')}
                  error={!!error.ownerName}
                  helperText={error?.ownerName ? error.ownerName.message : null}
                /> */}

                  <TextField
                    disabled
                    sx={{ width: "250px" }}
                    label={<FormattedLabel id="petName" />}
                    // disabled={router.query.pageMode == 'view'}
                    // @ts-ignore
                    // value={router.query.id && applicationDetails.petName}
                    InputLabelProps={{
                      shrink: router.query.id || watch("petName"),
                    }}
                    variant="standard"
                    {...register("petName")}
                    error={!!error.petName}
                    helperText={error?.petName ? error.petName.message : null}
                  />
                  <FormControl error={!!error.petBirthdate}>
                    {/* @ts-ignore */}
                    <Controller
                      control={control}
                      name="petBirthdate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            disabled
                            disableFuture
                            maxDate={maxBdate}
                            // disabled={router.query.pageMode == 'view'}
                            inputFormat="dd/MM/yyyy"
                            label={<FormattedLabel id="petBirthdate" />}
                            // @ts-ignore
                            value={
                              applicationDetails.petBirthdate ?? field.value
                            }
                            onChange={(date) => {
                              field.onChange(
                                moment(date, "YYYY-MM-DD").format("YYYY-MM-DD")
                              );
                              calcAge(date);
                            }}
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
                      {error?.petBirthdate ? error.petBirthdate.message : null}
                    </FormHelperText>
                  </FormControl>
                  <FormControl
                    disabled
                    variant="standard"
                    error={!!error.animalBreedKey}
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
                          value={
                            applicationDetails.animalBreedKey ?? field.value
                          }
                          onChange={(value) => field.onChange(value)}
                          label="animalBreedKey"
                        >
                          {petBreeds &&
                            petBreeds
                              .filter((obj) => {
                                return (
                                  obj.petAnimalKey == router.query.petAnimal
                                );
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
                      name="animalBreedKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {error?.animalBreedKey
                        ? error.animalBreedKey.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                  <TextField
                    disabled
                    sx={{ width: "250px" }}
                    label={<FormattedLabel id="animalColor" />}
                    // @ts-ignore
                    // value={router.query.id && applicationDetails.animalColor}
                    InputLabelProps={{
                      shrink: router.query.id || watch("animalColor"),
                    }}
                    variant="standard"
                    {...register("animalColor")}
                    error={!!error.animalColor}
                    helperText={
                      error?.animalColor ? error.animalColor.message : null
                    }
                  />
                  <TextField
                    sx={{ width: "250px" }}
                    label={<FormattedLabel id="animalAge" />}
                    disabled
                    InputLabelProps={{
                      shrink: router.query.id || watch("petBirthdate"),
                    }}
                    variant="standard"
                    {...register("animalAge")}
                    error={!!error.animalAge}
                    helperText={
                      error?.animalAge ? error.animalAge.message : null
                    }
                  />
                  <TextField
                    sx={{ width: "250px" }}
                    label={<FormattedLabel id="animalWeight" required />}
                    disabled={router.query.pageMode == "view"}
                    InputLabelProps={{
                      shrink: router.query.id || watch("animalWeight"),
                    }}
                    variant="standard"
                    {...register("animalWeight")}
                    error={!!error.animalWeight}
                    helperText={
                      error?.animalWeight ? error.animalWeight.message : null
                    }
                  />
                  <FormControl
                    disabled
                    variant="standard"
                    error={!!error.animalGender}
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
                          value={applicationDetails.animalGender ?? field.value}
                          onChange={(value) => field.onChange(value)}
                          label="animalGender"
                        >
                          <MenuItem key={1} value={"Male"}>
                            {language === "en" ? "Male" : "पुरुष"}
                          </MenuItem>
                          <MenuItem key={2} value={"Female"}>
                            {language === "en" ? "Female" : "स्त्री"}
                          </MenuItem>
                        </Select>
                      )}
                      name="animalGender"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {error?.animalGender ? error.animalGender.message : null}
                    </FormHelperText>
                  </FormControl>
                  <FormControl
                    disabled
                    variant="standard"
                    error={!!error.antiRabiesVaccinationStatus}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="antiRabiesVaccinationStatus" />
                    </InputLabel>
                    {/* @ts-ignore */}
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ width: "250px" }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={
                            // @ts-ignore
                            applicationDetails.antiRabiesVaccinationStatus ??
                            field.value
                          }
                          onChange={(value) => field.onChange(value)}
                          label="antiRabiesVaccinationStatus"
                        >
                          <MenuItem key={1} value={"y"}>
                            {language === "en" ? "Yes" : "हो"}
                          </MenuItem>
                          <MenuItem key={2} value={"n"}>
                            {language === "en" ? "No" : "नाही"}
                          </MenuItem>
                        </Select>
                      )}
                      name="antiRabiesVaccinationStatus"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {error?.antiRabiesVaccinationStatus
                        ? error.antiRabiesVaccinationStatus.message
                        : null}
                    </FormHelperText>
                  </FormControl>

                  {watch("antiRabiesVaccinationStatus") === "y" && (
                    <>
                      <FormControl error={!!error.vaccinationDate}>
                        {/* @ts-ignore */}
                        <Controller
                          control={control}
                          name="vaccinationDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                disableFuture
                                minDate={watch("petBirthdate")}
                                disabled={router.query.pageMode == "view"}
                                inputFormat="dd/MM/yyyy"
                                label={
                                  <FormattedLabel
                                    id="vaccinationDate"
                                    required
                                  />
                                }
                                value={
                                  // @ts-ignore
                                  applicationDetails.vaccinationDate ??
                                  field.value
                                }
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date, "YYYY-MM-DD").format(
                                      "YYYY-MM-DD"
                                    )
                                  )
                                }
                                renderInput={(params) => (
                                  <TextField
                                    sx={{ width: "250px" }}
                                    {...params}
                                    size="small"
                                    fullWidth
                                    variant="standard"
                                    error={!!error.vaccinationDate}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {error?.vaccinationDate
                            ? error.vaccinationDate.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                      <TextField
                        variant="standard"
                        sx={{ width: "250px" }}
                        label={
                          <FormattedLabel id="veterinaryDoctorsName" required />
                        }
                        disabled={router.query.pageMode == "view"}
                        // @ts-ignore
                        // value={router.query.id && applicationDetails.vetDocName}
                        InputLabelProps={{
                          shrink: router.query.id || watch("vetDocName"),
                        }}
                        {...register("vetDocName")}
                        error={!!error.vetDocName}
                        helperText={
                          error?.vetDocName ? error.vetDocName.message : null
                        }
                      />
                    </>
                  )}
                  <TextField
                    disabled={router.query.pageMode == "view"}
                    sx={{ width: "250px" }}
                    label={<FormattedLabel id="lattitude" />}
                    // @ts-ignore
                    // value={router.query.id && applicationDetails.lattitude}
                    variant="standard"
                    {...register("lattitude")}
                    InputLabelProps={{
                      shrink: router.query.id || watch("lattitude"),
                    }}
                    error={!!error.lattitude}
                    helperText={
                      error?.lattitude ? error.lattitude.message : null
                    }
                  />
                  <TextField
                    disabled={router.query.pageMode == "view"}
                    sx={{ width: "250px" }}
                    label={<FormattedLabel id="longitude" />}
                    // @ts-ignore
                    // value={router.query.id && applicationDetails.longitude}
                    variant="standard"
                    {...register("longitude")}
                    InputLabelProps={{
                      shrink: router.query.id || watch("longitude"),
                    }}
                    error={!!error.longitude}
                    helperText={
                      error?.longitude ? error.longitude.message : null
                    }
                  />
                  <div style={{ width: 250 }}></div>
                  <div style={{ width: 250 }}></div>
                  <div style={{ width: 250 }}></div>
                </div>

                <div className={styles.subTitle}>
                  <FormattedLabel id="documents" />
                </div>
                <div
                  className={styles.row}
                  style={{ marginTop: "1%", justifyContent: "center" }}
                >
                  <span
                    style={{
                      color: "red",
                      fontWeight: "bold",
                      fontStyle: "italic",
                    }}
                  >
                    <FormattedLabel id="uploadWarning" />
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    marginTop: 20,
                    gap: 35,
                  }}
                >
                  {watch("antiRabiesVaccinationStatus") === "y" && (
                    <div>
                      <UploadButton
                        appName="VMS"
                        serviceName="PetLicense"
                        label={<FormattedLabel id="vaccinationPDF" />}
                        filePath={vaccinationPdf}
                        fileUpdater={setvaccinationPdf}
                        view={router.query.pageMode == "view"}
                        readOnly={router.query.pageMode == "view"}
                        onlyPDF
                      />
                      <label style={{ color: "red" }}>
                        <FormattedLabel id="pdfOnly" />
                      </label>
                    </div>
                  )}
                  <div>
                    <UploadButton
                      appName="VMS"
                      serviceName="PetLicense"
                      label={<FormattedLabel id="animalPhoto" />}
                      filePath={petAnimalPhoto}
                      fileUpdater={setpetAnimalPhoto}
                      view={router.query.pageMode == "view"}
                      readOnly={router.query.pageMode == "view"}
                      onlyImage
                    />
                    <label style={{ color: "red" }}>
                      <FormattedLabel id="imageOnly" />
                    </label>
                  </div>
                  <div>
                    <UploadButton
                      appName="VMS"
                      serviceName="PetLicense"
                      label={<FormattedLabel id="ownerPhotoID" />}
                      filePath={ownerPhotoId}
                      fileUpdater={setOwnerPhotoID}
                      view={router.query.pageMode == "view"}
                      readOnly={router.query.pageMode == "view"}
                      imageAndPDF
                    />
                    <label style={{ color: "red" }}>
                      <FormattedLabel id="imageAndPDF" />
                    </label>
                  </div>
                  <div>
                    <UploadButton
                      appName="VMS"
                      serviceName="PetLicense"
                      label={<FormattedLabel id="oldLicense" />}
                      filePath={oldLicence}
                      fileUpdater={setOldLicence}
                      view={router.query.pageMode == "view"}
                      readOnly={router.query.pageMode == "view"}
                      imageAndPDF
                    />
                    <label style={{ color: "red" }}>
                      <FormattedLabel id="imageAndPDF" />
                    </label>
                  </div>
                  <div>
                    <UploadButton
                      appName="VMS"
                      serviceName="PetLicense"
                      label={<FormattedLabel id="addressProof" />}
                      filePath={addressProof}
                      fileUpdater={setAddressProof}
                      view={router.query.pageMode == "view"}
                      imageAndPDF
                      readOnly={router.query.pageMode == "view"}
                    />
                    <label style={{ color: "red" }}>
                      <FormattedLabel id="imageAndPDF" />
                    </label>
                  </div>
                  {router.query.id && (
                    <TextField
                      disabled
                      sx={{ width: "250px" }}
                      label={<FormattedLabel id="remark" />}
                      variant="standard"
                      // @ts-ignore
                      value={applicationDetails.scrutinyRemark ?? ""}
                    />
                  )}
                  <div style={{ width: "250px" }}></div>
                </div>
                {/* <div className={styles.row}>
                <TextField
                  disabled={router.query.pageMode == 'view'}
                  sx={{ width: '250px' }}
                  label={<FormattedLabel id='lattitude' />}
                  // @ts-ignore
                  // value={router.query.id && applicationDetails.lattitude}
                  variant='standard'
                  {...register('lattitude')}
                  InputLabelProps={{
                    shrink: router.query.id || watch('lattitude'),
                  }}
                  error={!!error.lattitude}
                  helperText={error?.lattitude ? error.lattitude.message : null}
                />
                <TextField
                  disabled={router.query.pageMode == 'view'}
                  sx={{ width: '250px' }}
                  label={<FormattedLabel id='longitude' />}
                  // @ts-ignore
                  // value={router.query.id && applicationDetails.longitude}
                  variant='standard'
                  {...register('longitude')}
                  InputLabelProps={{
                    shrink: router.query.id || watch('longitude'),
                  }}
                  error={!!error.longitude}
                  helperText={error?.longitude ? error.longitude.message : null}
                />
                <div style={{ width: '250px' }}></div>
              </div> */}
                {/* <div className={styles.row} style={{ justifyContent: "space-evenly" }}>
                <UploadButton
                  appName='VMS'
                  serviceName='PetLicense'
                  label={<FormattedLabel id="ownerPhotoID" />}
                  filePath={ownerPhotoId}
                  fileUpdater={setOwnerPhotoID}
                  view={router.query.id}
                />
                <UploadButton
                  appName='VMS'
                  serviceName='PetLicense'
                  label={<FormattedLabel id="ownerPhotoID" />}
                  filePath={oldLicence}
                  fileUpdater={setOldLicence}
                  view={router.query.id}
                />
              </div> */}
                {/* <div className={styles.row}>
                {router.query.id && (
                  <TextField
                    disabled
                    sx={{ width: "250px" }}
                    label={<FormattedLabel id="remark" />}
                    variant="standard"
                    // @ts-ignore
                    value={applicationDetails.scrutinyRemark ?? ""}
                  />
                )}
              </div> */}
              </>
            )}
            <div className={styles.buttons}>
              {router.query.pageMode != "view" && dataFetched && (
                <>
                  <Button
                    disabled={!enableState}
                    color="success"
                    variant="contained"
                    type="submit"
                    endIcon={<Save />}
                  >
                    <FormattedLabel id="save" />
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={clearFields}
                    endIcon={<Clear />}
                  >
                    <FormattedLabel id="clear" />
                  </Button>
                </>
              )}

              {
                // @ts-ignore
                applicationDetails.status === "Approved by HOD" && (
                  <Button
                    variant="contained"
                    onClick={payment}
                    endIcon={<Payment />}
                  >
                    <FormattedLabel id="makePayment" />
                  </Button>
                )
              }

              <Button
                variant="contained"
                color="error"
                endIcon={<ExitToApp />}
                onClick={() => {
                  isDeptUser
                    ? router.push(
                        `/veterinaryManagementSystem/transactions/renewalPetLicense/application`
                      )
                    : router.push(`/dashboard`);
                }}
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
