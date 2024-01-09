import { useSelector } from "react-redux";
import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";



// HawkerDetailsSchema
export let HawkerDetailsSchema = yup.object().shape({
  // title
  title: yup.string().required(<FormattedLabel id="titleValidation" />),
  // firstName
  firstName: yup.string().required(<FormattedLabel id="firstNameValidation" />),
  // middleName
  middleName: yup.string().required(<FormattedLabel id="middleNameValidation" />),
  // LastName
  lastName: yup.string().required(<FormattedLabel id="lastNameValidation" />),
  // gender
  gender: yup.string().required(<FormattedLabel id="genderValidation" />),
  // religion
  religion: yup.string().required(<FormattedLabel id="religionValidation" />),
  // castt
  castt: yup.string().required(<FormattedLabel id="casteValidation" />),
  // subCast
  subCast: yup.string().required(<FormattedLabel id="subCasteValidation" />),
  //  Date of Birth
  dateOfBirth: yup
    .date()
    .required(<FormattedLabel id="dateOfBirthValidation" />)
    .typeError("date of birth is required/जन्मतारीख आवश्यक आहे !!!"),
  // .typeError(
  //   "please enter valid date of birth/कृपया वैध जन्मतारीख प्रविष्ट करा !!!",
  // ),
  // Age
  age: yup
    .number()
    .required(<FormattedLabel id="ageValidation" />)
    .min(18, "age must be at least 18 year/वय किमान १८ वर्षे असावे")
    .max(99, "age is not valid above 99/वय 99 च्या वर वैध नाही ")
    .typeError(<FormattedLabel id="ageValidation" />),
  // Mobile
  mobile: yup
    .string()
    .required(<FormattedLabel id="mobileNovalidation" />)
    .matches(/^[0-9]+$/, "only digits are allowed/फक्त अंकांना परवानगी आहे")
    .min(10, "mobile number must be at least 10 number/मोबाईल क्रमांक किमान 10 अंकी असावा")
    .max(10, " mobile number is  not valid above 10 number/मोबाईल नंबर 10 अंकीवर वैध नाही")
    .typeError(),
  // emailaddress
  emailAddress: yup
    .string()
    .required(<FormattedLabel id="emailIdValidation" />)
    .email("please enter valid email address/कृपया वैध ई-मेल पत्ता प्रविष्ट करा")
    .typeError(),
  // rationcardno
  rationCardNo: yup
    .string()
    .required(<FormattedLabel id="rationCardNoValidation" />)
    .matches(/^[0-9]+$/, "only numbers are allowed/फक्त संख्यांना परवानगी आहे")
    .typeError(),
  // hawkerType
  hawkerType: yup.string().required(<FormattedLabel id="applicantTypeValidation" />),
  // disablityNameYN
  // typeofdisability
  //   typeOfDisability: yup
  //     .string()
  //     .required(<FormattedLabel id='typeOfDisabilityValidation' />),
});

export let AddressOfHawkerSchema = yup.object().shape({
  // cr  city survey number
  crCitySurveyNumber: yup
    .string()
    .required(<FormattedLabel id="citySurveyNoValdationA" />)
    .matches(/^[0-9]+$/, "only numbers are allowed / फक्त संख्यांना परवानगी आहे")
    .typeError(),
  // pr city survey number
  prCitySurveyNumber: yup
    .string()
    .required(<FormattedLabel id="citySurveyNoValdationA" />)
    .matches(/^[0-9]+$/, "only numbers are allowed / फक्त संख्यांना परवानगी आहे")
    .typeError(),
  // crAreaName
  crAreaName: yup.string().required(<FormattedLabel id="areaNameValidation" />),
  // prAreaName
  prAreaName: yup.string().required(<FormattedLabel id="areaNameValidation" />),
  // crLandmarkName
  crLandmarkName: yup.string().required(<FormattedLabel id="landmarkNameValidation" />),
  // prLandmarkName
  prLandmarkName: yup.string().required(<FormattedLabel id="landmarkNameValidation" />),
  // crVillageName
  crVillageName: yup.string().required(<FormattedLabel id="villageNameValidation" />),
  // prVillageName
  prVillageName: yup.string().required(<FormattedLabel id="villageNameValidation" />),
  // crCityName
  crCityName: yup.string().required(<FormattedLabel id="cityNameValidation" />),
  // prCityName
  prCityName: yup.string().required(<FormattedLabel id="cityNameValidation" />),
  // crState
  crState: yup.string().required(<FormattedLabel id="stateNameValidation" />),
  // prState
  prState: yup.string().required(<FormattedLabel id="stateNameValidation" />),
  // crPinCode
  crPincode: yup.string().required(<FormattedLabel id="pinCodeValidation" />),
  // prPincode
  prPincode: yup.string().required(<FormattedLabel id="pinCodeValidation" />),
  // crLattitude
  crLattitude: yup
    .string()
    .required(<FormattedLabel id="lattitudeValidation" />)
    .matches(/^[0-9]+$/, "only numbers are allowed / फक्त संख्यांना परवानगी आहे")
    .typeError(),
  // prLattitude
  prLattitude: yup
    .string()
    .required(<FormattedLabel id="lattitudeValidation" />)
    .matches(/^[0-9]+$/, "only numbers are allowed / फक्त संख्यांना परवानगी आहे")
    .typeError(),
  // crLogitude
  crLogitude: yup
    .string()
    .required(<FormattedLabel id="logitudeValidation" />)
    .matches(/^[0-9]+$/, "only numbers are allowed / फक्त संख्यांना परवानगी आहे")
    .typeError(),
  // prLogitude
  prLogitude: yup
    .string()
    .required(<FormattedLabel id="logitudeValidation" />)
    .matches(/^[0-9]+$/, "only numbers are allowed / फक्त संख्यांना परवानगी आहे")
    .typeError(),
});
export let AadharAuthenticationSchema = yup.object().shape({
  aadhaarNo: yup
    .string()
    .required(<FormattedLabel id="aadharNumberValidation" />)
    .matches(/^[0-9]+$/, "only digits are allowed/फक्त अंकांना परवानगी आहे")
    .min(12, "please enter valid aadhaar number/कृपया वैध आधार क्रमांक टाका")
    .max(12, "please enter valid aadhaar number/कृपया वैध आधार क्रमांक टाका")
    .typeError(),
});

export let PropertyAndWaterTaxesValidation = yup.object().shape({
  propertyTaxNumber: yup
    .string()
    .matches(/^[0-9]+$/, "only numbers are allowed / फक्त संख्यांना परवानगी आहे")
    .required(<FormattedLabel id="propertyTaxNumberValidation" />),
  proprtyAmount: yup
    .string()
    .required(<FormattedLabel id="proprtyTaxAmountNumberValidation" />)
    .matches(/^[0-9]+$/, "only numbers are allowed / फक्त संख्यांना परवानगी आहे")
    .typeError(),
  waterConsumerNo: yup
    .string()
    .matches(/^[0-9]+$/, "only numbers are allowed / फक्त संख्यांना परवानगी आहे")
    .required(<FormattedLabel id="waterConsumerNoValidation" />),
  waterAmount: yup
    .string()
    .required(<FormattedLabel id="waterTaxAmountVa  lidation" />)
    .matches(/^[0-9]+$/, "only numbers are allowed / फक्त संख्यांना परवानगी आहे")
    .typeError(),
});

export let BusinessDetailsSchema = yup.object().shape({
  // hawkingZoneName
  hawkingZoneName: yup.string().required(<FormattedLabel id="hawkingZoneNameValidation" />),
  // hawkerMode
  hawkerMode: yup.string().required(<FormattedLabel id="streetvendorModeNameValidation" />),
  // wardName,
  wardName: yup.string().required(<FormattedLabel id="wardNameValidation" />),
  // natureOfBusiness
  natureOfBusiness: yup.string().required(<FormattedLabel id="natureOfBusinessValidation" />),
  // hawkingDurationDaily
  // hawkingDurationDaily: yup
  //   .string()
  //   .required(<FormattedLabel id='hawkingDurationDailyValidation' />),
  // hawkerType
  hawkerType: yup.string().required(<FormattedLabel id="hawkerTypeValidation" />),
  // item
  item: yup.string().required(<FormattedLabel id="itemValidation" />),
  // oldLicenseYN
  // oldLicenseNo
  // oldLicenseNo: yup.string().required(<FormattedLabel id="oldLicenseNoValidation" />),
  // oldLicenseDate
  // oldLicenseDate: yup
  //   .date()
  //   .required(<FormattedLabel id="oldLicenseDateValidation" />)
  //   .typeError("old license date is required/जुनी परवाना तारीख आवश्यक आहे !!!"),
  // education
  education: yup.string().required(<FormattedLabel id="educationValidation" />),
  // areaOfStreetvendor
  areaOfStreetvendor: yup.string().required(<FormattedLabel id="areaOfStreetvendorValidation" />),
  // periodOfResidenceInPCMC
  periodOfResidenceInPCMC: yup
    .date()
    .required(<FormattedLabel id="periodOfResidenceInPCMCValidation" />)
    .typeError("period of residence in PCMC is required/पीसीएमसीमध्ये राहण्याचा कालावधी आवश्यक आहे!!!"),
  // periodOfResidenceInMaharashtra
  periodOfResidenceInMaharashtra: yup
    .date()
    .required(<FormattedLabel id="periodOfResidenceInMaharashtraValidation" />)
    .typeError("period of residence in maharashtra is required/महाराष्ट्रात राहण्याचा कालावधी आवश्यक आहे!!"),
  // voterNameYN
  voterNameYN: yup.string().required(<FormattedLabel id="voterNameYNValidation" />),
  // voterId
  // voterId: yup.string().required(<FormattedLabel id="voterIdValidation" />),
  // bankMaster
  bankMaster: yup.string().required(<FormattedLabel id="bankMasterValidation" />),
  // branchName
  branchName: yup.string().required(<FormattedLabel id="branchNameValidation" />),
  // bankAccountNo
  bankAccountNo: yup
    .string()
    .required(<FormattedLabel id="bankAccountNoValidation" />)
    .matches(/^[0-9]+$/, "only digits are allowed/फक्त अंकांना परवानगी आहे")
    .min(12, "please enter valid bank account number/कृपया वैध बँक खाते क्रमांक प्रविष्ट करा")
    .max(17, "please enter valid bank account number/कृपया वैध बँक खाते क्रमांक प्रविष्ट करा")
    .typeError(<FormattedLabel id="bankAccountNoValidation" />),
  //ifscCode
  ifscCode: yup.string().required(<FormattedLabel id="ifscCodeValidation" />),
});

// doucmentUpload
export let DocumentsUploadSchema = yup.object().shape({
  //aadhaarCardPhoto
  aadharPhoto: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="aadhaarCardPhotoValidation" />),
  //panCardPhoto
  panCardPhoto: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="panCardPhotoValidation" />),
  //rationCardPhoto
  rationCardPhoto: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="rationCardPhotoValidation" />),
  //disablityCertificatePhoto
  // disablityCertificatePhoto: yup
  //   .string()
  //   .nullable()
  //   .required(<FormattedLabel id="disablityCertificatePhotoValidation" />),
  //affidaviteOnRS100StampAttache
  affidaviteOnRS100StampAttache: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="affidaviteOnRS100StampAttacheValidation" />),
  // otherDocumentPhoto
  // otherDocumentPhoto: yup
  //   .string()
  //   .nullable()
  //   .required(<FormattedLabel id='otherDocumentPhotoValidation' />),
});

export let IssuanceOfHawkerLicenseCitizenSchema = yup.object().shape({
  // city survey no
  citySurveyNo: yup
    .string()
    .required(<FormattedLabel id="citySurveyNoValdationA" />)
    .matches(/^[0-9]+$/, "only numbers are allowed / फक्त संख्यांना परवानगी आहे")
    .typeError(),
  // hawkingZoneName
  hawkingZoneName: yup.string().required(<FormattedLabel id="hawkingZoneNameValidation" />),
  // Area Name
  areaName: yup.string().required(<FormattedLabel id="areaNameValidation" />),
  // title
  title: yup.string().required(<FormattedLabel id="titleValidation" />),
  // firstName
  firstName: yup.string().required(<FormattedLabel id="firstNameValidation" />),
  // middleName
  middleName: yup.string().required(<FormattedLabel id="middleNameValidation" />),
  // LastName
  lastName: yup.string().required(<FormattedLabel id="lastNameValidation" />),
  // gender
  gender: yup.string().required(<FormattedLabel id="genderValidation" />),
  // religion
  religion: yup.string().required(<FormattedLabel id="religionValidation" />),
  // castt
  castt: yup.string().required(<FormattedLabel id="casteValidation" />),
  // subCast
  subCast: yup.string().required(<FormattedLabel id="subCasteValidation" />),
  //  Date of Birth
  dateOfBirth: yup
    .date()
    .required(<FormattedLabel id="dateOfBirthValidation" />)
    .typeError("date of birth is required/जन्मतारीख आवश्यक आहे !!!"),
  // .typeError(
  //   "please enter valid date of birth/कृपया वैध जन्मतारीख प्रविष्ट करा !!!",
  // ),
  // Age
  age: yup
    .number()
    .required(<FormattedLabel id="ageValidation" />)
    .min(18, "age must be at least 18 year/वय किमान १८ वर्षे असावे")
    .max(99, "age is not valid above 99/वय 99 च्या वर वैध नाही ")
    .typeError(<FormattedLabel id="ageValidation" />),
  // Mobile
  mobile: yup
    .string()
    .required(<FormattedLabel id="mobileNovalidation" />)
    .matches(/^[0-9]+$/, "only digits are allowed/फक्त अंकांना परवानगी आहे")
    .min(10, "mobile number must be at least 10 number/मोबाईल क्रमांक किमान 10 अंकी असावा")
    .max(10, " mobile number is  not valid above 10 number/मोबाईल नंबर 10 अंकीवर वैध नाही")
    .typeError(),
  // emailaddress
  emailAddress: yup
    .string()
    .required(<FormattedLabel id="emailIdValidation" />)
    .email("please enter valid email address/कृपया वैध ई-मेल पत्ता प्रविष्ट करा")
    .typeError(),
  // rationcardno
  rationCardNo: yup
    .string()
    .required(<FormattedLabel id="rationCardNoValidation" />)
    .matches(/^[0-9]+$/, "only numbers are allowed/फक्त संख्यांना परवानगी आहे")
    .typeError(),
  // hawkerType
  hawkerType: yup.string().required(<FormattedLabel id="applicantTypeValidation" />),
  // disablityNameYN
  // typeofdisability
  //   typeOfDisability: yup
  //     .string()
  //     .required(<FormattedLabel id='typeOfDisabilityValidation' />),
  // cr  city survey number
  crCitySurveyNumber: yup
    .string()
    .required(<FormattedLabel id="citySurveyNoValdationA" />)
    .matches(/^[0-9]+$/, "only numbers are allowed / फक्त संख्यांना परवानगी आहे")
    .typeError(),
  // pr city survey number
  prCitySurveyNumber: yup
    .string()
    .required(<FormattedLabel id="citySurveyNoValdationA" />)
    .matches(/^[0-9]+$/, "only numbers are allowed / फक्त संख्यांना परवानगी आहे")
    .typeError(),
  // crAreaName
  crAreaName: yup.string().required(<FormattedLabel id="areaNameValidation" />),
  // prAreaName
  prAreaName: yup.string().required(<FormattedLabel id="areaNameValidation" />),
  // crLandmarkName
  crLandmarkName: yup.string().required(<FormattedLabel id="landmarkNameValidation" />),
  // prLandmarkName
  prLandmarkName: yup.string().required(<FormattedLabel id="landmarkNameValidation" />),
  // crVillageName
  crVillageName: yup.string().required(<FormattedLabel id="villageNameValidation" />),
  // prVillageName
  prVillageName: yup.string().required(<FormattedLabel id="villageNameValidation" />),
  // crCityName
  crCityName: yup.string().required(<FormattedLabel id="cityNameValidation" />),
  // prCityName
  prCityName: yup.string().required(<FormattedLabel id="cityNameValidation" />),
  // crState
  crState: yup.string().required(<FormattedLabel id="stateNameValidation" />),
  // prState
  prState: yup.string().required(<FormattedLabel id="stateNameValidation" />),
  // crPinCode
  crPincode: yup.string().required(<FormattedLabel id="pinCodeValidation" />),
  // prPincode
  prPincode: yup.string().required(<FormattedLabel id="pinCodeValidation" />),
  // crLattitude
  crLattitude: yup
    .string()
    .required(<FormattedLabel id="lattitudeValidation" />)
    .matches(/^[0-9]+$/, "only numbers are allowed / फक्त संख्यांना परवानगी आहे")
    .typeError(),
  // prLattitude
  prLattitude: yup
    .string()
    .required(<FormattedLabel id="lattitudeValidation" />)
    .matches(/^[0-9]+$/, "only numbers are allowed / फक्त संख्यांना परवानगी आहे")
    .typeError(),
  // crLogitude
  crLogitude: yup
    .string()
    .required(<FormattedLabel id="logitudeValidation" />)
    .matches(/^[0-9]+$/, "only numbers are allowed / फक्त संख्यांना परवानगी आहे")
    .typeError(),
  // prLogitude
  prLogitude: yup
    .string()
    .required(<FormattedLabel id="logitudeValidation" />)
    .matches(/^[0-9]+$/, "only numbers are allowed / फक्त संख्यांना परवानगी आहे")
    .typeError(),
  aadhaarNo: yup
    .string()
    .required(<FormattedLabel id="aadharNumberValidation" />)
    .matches(/^[0-9]+$/, "only digits are allowed/फक्त अंकांना परवानगी आहे")
    .min(12, "please enter valid aadhaar number/कृपया वैध आधार क्रमांक टाका")
    .max(12, "please enter valid aadhaar number/कृपया वैध आधार क्रमांक टाका")
    .typeError(),
  propertyTaxNumber: yup
    .string()
    .matches(/^[0-9]+$/, "only numbers are allowed / फक्त संख्यांना परवानगी आहे")
    .required(<FormattedLabel id="propertyTaxNumberValidation" />),
  proprtyAmount: yup
    .string()
    .required(<FormattedLabel id="proprtyTaxAmountNumberValidation" />)
    .matches(/^[0-9]+$/, "only numbers are allowed / फक्त संख्यांना परवानगी आहे")
    .typeError(),
  waterConsumerNo: yup
    .string()
    .matches(/^[0-9]+$/, "only numbers are allowed / फक्त संख्यांना परवानगी आहे")
    .required(<FormattedLabel id="waterConsumerNoValidation" />),
  waterAmount: yup
    .string()
    .required(<FormattedLabel id="waterTaxAmountVa  lidation" />)
    .matches(/^[0-9]+$/, "only numbers are allowed / फक्त संख्यांना परवानगी आहे")
    .typeError(),
  // hawkingZoneName
  hawkingZoneName: yup.string().required(<FormattedLabel id="hawkingZoneNameValidation" />),
  // hawkerMode
  hawkerMode: yup.string().required(<FormattedLabel id="streetvendorModeNameValidation" />),
  // wardName,
  wardName: yup.string().required(<FormattedLabel id="wardNameValidation" />),
  // natureOfBusiness
  natureOfBusiness: yup.string().required(<FormattedLabel id="natureOfBusinessValidation" />),
  // hawkingDurationDaily
  // hawkingDurationDaily: yup
  //   .string()
  //   .required(<FormattedLabel id='hawkingDurationDailyValidation' />),
  // hawkerType
  hawkerType: yup.string().required(<FormattedLabel id="hawkerTypeValidation" />),
  // item
  item: yup.string().required(<FormattedLabel id="itemValidation" />),
  // oldLicenseYN
  // oldLicenseNo
  // oldLicenseNo: yup.string().required(<FormattedLabel id="oldLicenseNoValidation" />),
  // oldLicenseDate
  // oldLicenseDate: yup
  //   .date()
  //   .required(<FormattedLabel id="oldLicenseDateValidation" />)
  //   .typeError("old license date is required/जुनी परवाना तारीख आवश्यक आहे !!!"),
  // education
  education: yup.string().required(<FormattedLabel id="educationValidation" />),
  // areaOfStreetvendor
  areaOfStreetvendor: yup.string().required(<FormattedLabel id="areaOfStreetvendorValidation" />),
  // periodOfResidenceInPCMC
  periodOfResidenceInPCMC: yup
    .date()
    .required(<FormattedLabel id="periodOfResidenceInPCMCValidation" />)
    .typeError("period of residence in PCMC is required/पीसीएमसीमध्ये राहण्याचा कालावधी आवश्यक आहे!!!"),
  // periodOfResidenceInMaharashtra
  periodOfResidenceInMaharashtra: yup
    .date()
    .required(<FormattedLabel id="periodOfResidenceInMaharashtraValidation" />)
    .typeError("period of residence in maharashtra is required/महाराष्ट्रात राहण्याचा कालावधी आवश्यक आहे!!"),
  // voterNameYN
  voterNameYN: yup.string().required(<FormattedLabel id="voterNameYNValidation" />),
  // voterId
  // voterId: yup.string().required(<FormattedLabel id="voterIdValidation" />),
  // bankMaster
  bankMaster: yup.string().required(<FormattedLabel id="bankMasterValidation" />),
  // branchName
  branchName: yup.string().required(<FormattedLabel id="branchNameValidation" />),
  // bankAccountNo
  bankAccountNo: yup
    .string()
    .required(<FormattedLabel id="bankAccountNoValidation" />)
    .matches(/^[0-9]+$/, "only digits are allowed/फक्त अंकांना परवानगी आहे")
    .min(12, "please enter valid bank account number/कृपया वैध बँक खाते क्रमांक प्रविष्ट करा")
    .max(17, "please enter valid bank account number/कृपया वैध बँक खाते क्रमांक प्रविष्ट करा")
    .typeError(<FormattedLabel id="bankAccountNoValidation" />),
  //ifscCode
  ifscCode: yup.string().required(<FormattedLabel id="ifscCodeValidation" />),
  //aadhaarCardPhoto
  aadharPhoto: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="aadhaarCardPhotoValidation" />),
  //panCardPhoto
  panCardPhoto: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="panCardPhotoValidation" />),
  //rationCardPhoto
  rationCardPhoto: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="rationCardPhotoValidation" />),
  //disablityCertificatePhoto
  disablityCertificatePhoto: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="disablityCertificatePhotoValidation" />),
  //affidaviteOnRS100StampAttache
  affidaviteOnRS100StampAttache: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="affidaviteOnRS100StampAttacheValidation" />),
  // otherDocumentPhoto
  // otherDocumentPhoto: yup
  //   .string()
  //   .nullable()
  // //   .required(<FormattedLabel id='otherDocumentPhotoValidation' />),
});
