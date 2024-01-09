import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// HawkerDetailsSchema
export let HawkerDetailsSchema = ({
  language,
  castOtherA,
  castCategoryOtherA,
  applicantTypeOtherA,
  disablityNameYNA,
}) => {

  console.log("language21312", language)
  return yup.object().shape({
    //     // // title
    //     title: yup
    //       .string()
    //       .nullable()
    //       .required(<FormattedLabel id="titleValidation" />),

    //     // // firstName
    //     firstName: yup
    //       .string()
    //       .matches(
    //         /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/,
    //         language == "en"
    //           ? "only english words are allowed"
    //           : "फक्त इंग्रजी शब्दांना परवानगी आहे"
    //       )
    //       .required(<FormattedLabel id="firstNameValidation" />),

    //     // // firstNameMr
    //     firstNameMr: yup
    //       .string()
    //       .required(<FormattedLabel id="firstNameValidationMr" />)
    //       .matches(
    //         /^[\u0900-\u097F]+(?:\s[\u0900-\u097F]+)*$/,
    //         language == "en"
    //           ? "only marathi words are allowed"
    //           : "फक्त मराठी शब्दांना परवानगी आहे"
    //       ),

    //     //  // middleName
    //     middleName: yup
    //       .string()
    //       .matches(
    //         /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/,
    //         language == "en"
    //           ? "only english words are allowed"
    //           : "फक्त इंग्रजी शब्दांना परवानगी आहे"
    //       )
    //       .required(<FormattedLabel id="middleNameValidation" />),

    //     //  // middleNameMr
    //     middleNameMr: yup
    //       .string()
    //       .required(<FormattedLabel id="middleNameValidationMr" />)
    //       .matches(
    //         /^[\u0900-\u097F]+(?:\s[\u0900-\u097F]+)*$/,
    //         language == "en"
    //           ? "only marathi words are allowed"
    //           : "फक्त मराठी शब्दांना परवानगी आहे"
    //       ),

    //     //// LastName
    //     lastName: yup
    //       .string()
    //       .matches(
    //         /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/,
    //         language == "en"
    //           ? "only english words are allowed"
    //           : "फक्त इंग्रजी शब्दांना परवानगी आहे"
    //       )
    //       .required(<FormattedLabel id="lastNameValidation" />),

    //     //// lastNameMr
    //     lastNameMr: yup
    //       .string()
    //       .required(<FormattedLabel id="lastNameValidationMr" />)
    //       .matches(
    //         /^[\u0900-\u097F]+(?:\s[\u0900-\u097F]+)*$/,
    //         language == "en"
    //           ? "only marathi words are allowed"
    //           : "फक्त मराठी शब्दांना परवानगी आहे"
    //       ),

    //     //// gender
    //     gender: yup
    //       .string()
    //       .nullable()
    //       .required(<FormattedLabel id="genderValidation" />),

    //     //// religion
    //     religion: yup
    //       .string()
    //       .nullable()
    //       .required(<FormattedLabel id="religionValidation" />),

    //     //  // castt
    //     castt: yup
    //       .string()
    //       .nullable()
    //       .required(<FormattedLabel id="casteValidation" />),

    //     // castOther
    //     castOther: yup.string().when(["castOtherA"], {
    //       is: (castOtherA) => castOtherA === true,
    //       then: yup.string().required(<FormattedLabel id="casteOtherValidation" />),
    //       otherwise: yup.string().nullable(),
    //     }),

    //     //// castCategory
    //     castCategory: yup
    //       .string()
    //       .nullable()
    //       .required(<FormattedLabel id="castCategoryValidation" />),

    //     //  // castCategoryOther
    //     castCategoryOther: yup.string().when(["castCategoryOtherA"], {
    //       is: (castCategoryOtherA) => castCategoryOtherA === true,
    //       then: yup
    //         .string()
    //         .required(<FormattedLabel id="casteCategoryOtherValidation" />),
    //       otherwise: yup.string().nullable(),
    //     }),

    //     // //  Date of Birth
    //     dateOfBirth: yup
    //       .date()
    //       .required(<FormattedLabel id="dateOfBirthValidation" />)
    //       .typeError(
    //         language == "en"
    //           ? "date of birth is required"
    //           : "जन्मतारीख आवश्यक आहे !!!"
    //       ),

    //     // // Age
    //     age: yup
    //       .number()
    //       .required(<FormattedLabel id="ageValidation" />)
    //       .min(
    //         14,
    //         language == "en"
    //           ? "age must be at least 14 year"
    //           : "वय किमान १४ वर्षे असावे"
    //       )
    //       .max(
    //         99,
    //         language == "en"
    //           ? "age is not valid above 99"
    //           : "वय 99 च्या वर वैध नाही "
    //       )
    //       .typeError(<FormattedLabel id="ageValidation" />),

    //     //  // Mobile
    //     mobile: yup
    //       .string()
    //       .required(<FormattedLabel id="mobileNovalidation" />)
    //       .matches(
    //         /^[6-9]\d{9}$/,
    //         language == "en" ? "Invalid mobile number" : "अवैध मोबाईल नंबर"
    //       )
    //       .min(
    //         10,
    //         language == "en"
    //           ? "mobile number must be at least 10 number"
    //           : "मोबाईल क्रमांक किमान 10 अंकी असावा"
    //       )
    //       .max(
    //         10,
    //         language == "en"
    //           ? " mobile number is  not valid above 10 number"
    //           : "मोबाईल नंबर 10 अंकीवर वैध नाही"
    //       )
    //       .typeError(
    //         language == "en" ? "Invalid mobile number" : "अवैध मोबाईल नंबर"
    //       ),

    //     //   // emailaddress
    //     emailAddress: yup
    //       .string()
    //       .required(<FormattedLabel id="emailIdValidation" />)
    //       .email(
    //         language == "en"
    //           ? "please enter valid email address"
    //           : "कृपया वैध ई-मेल पत्ता प्रविष्ट करा"
    //       )
    //       .typeError(),

    //     // // rationcardno
    //     rationCardNo: yup
    //       .string()
    //       .required(<FormattedLabel id="rationCardNoValidation" />)
    //       .matches(
    //         /^[A-Za-z0-9]{12}$/,
    //         language == "en"
    //           ? "please enter valid ration card number !!!"
    //           : "कृपया वैध शिधापत्रिका क्रमांक प्रविष्ट करा !!!"
    //       )
    //       .min(
    //         12,
    //         language == "en"
    //           ? "please enter valid ration card number !!!"
    //           : "कृपया वैध शिधापत्रिका क्रमांक प्रविष्ट करा !!!"
    //       )
    //       .max(
    //         12,
    //         language == "en"
    //           ? "please enter valid ration card number !!!"
    //           : "कृपया वैध शिधापत्रिका क्रमांक प्रविष्ट करा !!!"
    //       )
    //       .typeError(),

    //     // Applicant Type
    //     applicantType: yup
    //       .string()
    //       .nullable()
    //       .required(<FormattedLabel id="applicantTypeValidation" />),

    //     applicantTypeOther: yup.string().when(["applicantTypeOtherA"], {
    //       is: (applicantTypeOtherA) => applicantTypeOtherA === true,
    //       then: yup
    //         .string()
    //         .matches(
    //           /^[^\s\d]+(?:\s[^\s\d]+)*$/,
    //           language == "en"
    //             ? "please enter valid applicant type other"
    //             : "कृपया वैध अर्जदार प्रकार इतर प्रविष्ट करा"
    //         )
    //         .required(<FormattedLabel id="applicantTypeOtherValidation" />),
    //       otherwise: yup.string().nullable(),
    //     }),

    //     // // disblityNameYesNo
    //     disablityNameYN: yup
    //       .boolean()
    //       .nullable()
    //       .required(<FormattedLabel id="disablityNameYNValidation" />)
    //       .typeError(<FormattedLabel id="disablityNameYNValidation" />),

    //     //  // typeOfDisability
    //     typeOfDisability: yup.string().when(["disablityNameYNA"], {
    //       is: (disablityNameYNA) => disablityNameYNA === true,
    //       then: yup
    //         .string()
    //         .nullable()
    //         .required(<FormattedLabel id="typeOfDisabilityValidation" />),
    //       otherwise: yup.string().nullable(),
    //     }),

    //     //disablityPrecntage
    //     disablityPrecntage: yup.string().when(["disablityNameYNA"], {
    //       is: (disablityNameYNA) => disablityNameYNA === true,
    //       then: yup
    //         .string()
    //         .matches(
    //           /^(?:[1-9]|[1-9][0-9]|100)$/,
    //           language == "en"
    //             ? "please enter valid disability percentage"
    //             : "कृपया वैध अपंगत्व टक्केवारी प्रविष्ट करा"
    //         )
    //         .required(<FormattedLabel id="disablityPrecntageValidation" />),
    //       otherwise: yup.string().nullable(),
    //     }),
    //   });
    // };

    // // AddressOfHawkerSchema
    // export let AddressOfHawkerSchema = (language) => {
    //   console.log("sdfds",language)
    //   return yup.object().shape({
    //     //  // cr  city survey number
    //     crCitySurveyNumber: yup
    //       .string()
    //       .required(<FormattedLabel id="citySurveyNoValdationA" />)
    //       .matches(
    //         /^[0-9]+$/,
    //         language == "en"
    //           ? "only numbers are allowed"
    //           : "फक्त संख्यांना परवानगी आहे"
    //       )
    //       .typeError(),
    //     // // pr city survey number
    //     prCitySurveyNumber: yup
    //       .string()
    //       .required(<FormattedLabel id="citySurveyNoValdationA" />)
    //       .matches(
    //         /^[0-9]+$/,
    //         language == "en"
    //           ? "only numbers are allowed"
    //           : "फक्त संख्यांना परवानगी आहे"
    //       )
    //       .typeError(),
    //     //// crZoneKey
    //     crZoneKey: yup
    //       .string()
    //       .nullable()
    //       .required(<FormattedLabel id="zoneNameValidation" />),
    //     ////prZoneKey
    //     prZoneKey: yup
    //       .string()
    //       .nullable()
    //       .required(<FormattedLabel id="zoneNameValidation" />),
    //     //// crWardName
    //     crWardName: yup
    //       .string()
    //       .nullable()
    //       .required(<FormattedLabel id="wardNameValidation" />),
    //     ////  prWardName
    //     prWardName: yup
    //       .string()
    //       .nullable()
    //       .required(<FormattedLabel id="wardNameValidation" />),
    //     // // crAreaName
    //     crAreaName: yup
    //       .string()
    //       .nullable()
    //       .required(<FormattedLabel id="areaNameValidation" />),
    //     //  // prAreaName
    //     prAreaName: yup
    //       .string()
    //       .nullable()
    //       .required(<FormattedLabel id="areaNameValidation" />),
    //     // // crLandmarkName
    //     crLandmarkName: yup
    //       .string()
    //       .nullable()
    //       .required(<FormattedLabel id="landmarkNameValidation" />),
    //     //   // prLandmarkName
    //     prLandmarkName: yup
    //       .string()
    //       .nullable()
    //       .required(<FormattedLabel id="landmarkNameValidation" />),
    //     // // crVillageName
    //     crVillageName: yup
    //       .string()
    //       .nullable()
    //       .required(<FormattedLabel id="roadNameValidation" />),
    //     // // prVillageName
    //     prVillageName: yup
    //       .string()
    //       .nullable()
    //       .required(<FormattedLabel id="roadNameValidation" />),
    //     //  // crCityName
    //     crCityName: yup
    //       .string()
    //       .nullable()
    //       .required(<FormattedLabel id="cityNameValidation" />),
    //     //  // prCityName
    //     prCityName: yup
    //       .string()
    //       .nullable()
    //       .required(<FormattedLabel id="cityNameValidation" />),
    //     //  // crState
    //     crState: yup
    //       .string()
    //       .nullable()
    //       .required(<FormattedLabel id="stateNameValidation" />),
    //     //  // prState
    //     prState: yup
    //       .string()
    //       .nullable()
    //       .required(<FormattedLabel id="stateNameValidation" />),
    //     //  // crPinCode
    //     crPincode: yup
    //       .string()
    //       .nullable()
    //       .required(<FormattedLabel id="pinCodeValidation" />),
    //     //  // prPincode
    //     prPincode: yup
    //       .string()
    //       .nullable()
    //       .required(<FormattedLabel id="pinCodeValidation" />),
    //     //  // crLattitude
    //     crLattitude: yup
    //       .string()
    //       .nullable()
    //       .test(
    //         "is-valid",
    //         language == "en"
    //           ? "only numbers are allowed"
    //           : "फक्त संख्यांना परवानगी आहे",
    //         (value) => {
    //           if (!value) return true;
    //           return /^\d+(\.\d+)?$/.test(value);
    //         }
    //       )
    //       .typeError(
    //         language == "en"
    //           ? "only numbers are allowed"
    //           : "फक्त संख्यांना परवानगी आहे"
    //       ),
    //     //  // prLattitude
    //     prLattitude: yup
    //       .string()
    //       .nullable()
    //       .test(
    //         "is-valid",
    //         language == "en"
    //           ? "only numbers are allowed"
    //           : "फक्त संख्यांना परवानगी आहे",
    //         (value) => {
    //           if (!value) return true;
    //           return /^\d+(\.\d+)?$/.test(value);
    //         }
    //       )
    //       .typeError(
    //         language == "en"
    //           ? "only numbers are allowed"
    //           : "फक्त संख्यांना परवानगी आहे"
    //       ),

    //     //  // crLogitude
    //     crLogitude: yup
    //       .string()
    //       .nullable()
    //       .test(
    //         "is-valid",
    //         language == "en"
    //           ? "only numbers are allowed"
    //           : "फक्त संख्यांना परवानगी आहे",
    //         (value) => {
    //           if (!value) return true;
    //           return /^\d+(\.\d+)?$/.test(value);
    //         }
    //       )
    //       .typeError(
    //         language == "en"
    //           ? "only numbers are allowed"
    //           : "फक्त संख्यांना परवानगी आहे"
    //       ),

    //     // // prLogitude
    //     prLogitude: yup
    //       .string()
    //       .nullable()
    //       .test(
    //         "is-valid",
    //         language == "en"
    //           ? "only numbers are allowed"
    //           : "फक्त संख्यांना परवानगी आहे",
    //         (value) => {
    //           if (!value) return true;
    //           return /^\d+(\.\d+)?$/.test(value);
    //         }
    //       )
    //       .typeError(
    //         language == "en"
    //           ? "only numbers are allowed"
    //           : "फक्त संख्यांना परवानगी आहे"
    //       ),
  });
};

export let AddressOfHawkerSchema1 = (language) => {
  console.log("sdfds", language)
  return yup.object().shape({
    // //  // cr  city survey number
    // crCitySurveyNumber: yup
    //   .string()
    //   .required(<FormattedLabel id="citySurveyNoValdationA" />)
    //   .matches(
    //     /^[0-9]+$/,
    //     language == "en"
    //       ? "only numbers are allowed"
    //       : "फक्त संख्यांना परवानगी आहे"
    //   )
    //   .typeError(),
    // // // pr city survey number
    // prCitySurveyNumber: yup
    //   .string()
    //   .required(<FormattedLabel id="citySurveyNoValdationA" />)
    //   .matches(
    //     /^[0-9]+$/,
    //     language == "en"
    //       ? "only numbers are allowed"
    //       : "फक्त संख्यांना परवानगी आहे"
    //   )
    //   .typeError(),
    // //// crZoneKey
    // crZoneKey: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="zoneNameValidation" />),
    // ////prZoneKey
    // prZoneKeyT: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="zoneNameValidation" />),
    // //// crWardName
    // crWardName: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="wardNameValidation" />),
    // ////  prWardName
    // prWardNameT: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="wardNameValidation" />),
    // // // crAreaName
    // crAreaName: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="areaNameValidation" />),
    // //  // prAreaName
    // prAreaNameT: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="areaNameValidation" />),
    // // // crLandmarkName
    // crLandmarkName: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="landmarkNameValidation" />),
    // //   // prLandmarkName
    // prLandmarkNameT: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="landmarkNameValidation" />),
    // // // crVillageName
    // crVillageName: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="roadNameValidation" />),
    // // // prVillageName
    // prVillageNameT: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="roadNameValidation" />),
    // //  // crCityName
    // crCityName: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="cityNameValidation" />),
    // //  // prCityName
    // prCityName: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="cityNameValidation" />),
    // //  // crState
    // crState: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="stateNameValidation" />),
    // //  // prState
    // prState: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="stateNameValidation" />),
    // //  // crPinCode
    // crPincode: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="pinCodeValidation" />),
    // //  // prPincode
    // prPincodeT: yup
    //   .string()
    //   .required(<FormattedLabel id="pinCodeValidation" />)
    //   .matches(
    //     /^[0-9]+$/,
    //     language === "en"
    //       ? "Invalid PIN code. Only numbers are allowed."
    //       : "अवैध पिन कोड. फक्त संख्यांना परवानगी आहे."
    //   )
    //   .min(
    //     6,
    //     language == "en"
    //       ? "Invalid PIN code. Please enter a 6-digit number."
    //       : "अवैध पिन कोड. कृपया 6-अंकी क्रमांक प्रविष्ट करा."
    //   )
    //   .max(
    //     6,
    //     language == "en"
    //       ? "Invalid PIN code. Please enter a 6-digit number."
    //       : "अवैध पिन कोड. कृपया 6-अंकी क्रमांक प्रविष्ट करा."
    //   )
    //   .typeError(
    //     language === "en"
    //       ? "Invalid PIN code. Only numbers are allowed."
    //       : "अवैध पिन कोड. फक्त संख्यांना परवानगी आहे."
    //   ),

    // //  // crLattitude
    // crLattitude: yup
    //   .string()
    //   .nullable()
    //   .test(
    //     "is-valid",
    //     language == "en"
    //       ? "only numbers are allowed"
    //       : "फक्त संख्यांना परवानगी आहे",
    //     (value) => {
    //       if (!value) return true;
    //       return /^\d+(\.\d+)?$/.test(value);
    //     }
    //   )
    //   .typeError(
    //     language == "en"
    //       ? "only numbers are allowed"
    //       : "फक्त संख्यांना परवानगी आहे"
    //   ),
    // //  // prLattitude
    // prLattitude: yup
    //   .string()
    //   .nullable()
    //   .test(
    //     "is-valid",
    //     language == "en"
    //       ? "only numbers are allowed"
    //       : "फक्त संख्यांना परवानगी आहे",
    //     (value) => {
    //       if (!value) return true;
    //       return /^\d+(\.\d+)?$/.test(value);
    //     }
    //   )
    //   .typeError(
    //     language == "en"
    //       ? "only numbers are allowed"
    //       : "फक्त संख्यांना परवानगी आहे"
    //   ),

    // //  // crLogitude
    // crLogitude: yup
    //   .string()
    //   .nullable()
    //   .test(
    //     "is-valid",
    //     language == "en"
    //       ? "only numbers are allowed"
    //       : "फक्त संख्यांना परवानगी आहे",
    //     (value) => {
    //       if (!value) return true;
    //       return /^\d+(\.\d+)?$/.test(value);
    //     }
    //   )
    //   .typeError(
    //     language == "en"
    //       ? "only numbers are allowed"
    //       : "फक्त संख्यांना परवानगी आहे"
    //   ),

    // // // prLogitude
    // prLogitude: yup
    //   .string()
    //   .nullable()
    //   .test(
    //     "is-valid",
    //     language == "en"
    //       ? "only numbers are allowed"
    //       : "फक्त संख्यांना परवानगी आहे",
    //     (value) => {
    //       if (!value) return true;
    //       return /^\d+(\.\d+)?$/.test(value);
    //     }
    //   )
    //   .typeError(
    //     language == "en"
    //       ? "only numbers are allowed"
    //       : "फक्त संख्यांना परवानगी आहे"
    //   ),
  });
};

// AadharAuthenticationSchema
export let AadharAuthenticationSchema = (language) => {
  return yup.object().shape({
    // aadhaarNo: yup
    //   .string()
    //   .required(<FormattedLabel id="aadharNumberValidation" />)
    //   .matches(
    //     /^[2-9]\d{11}$/,
    //     language == "en" ? "Invalid Aadhaar number" : "अवैध आधार क्रमांक"
    //   )
    //   .matches(
    //     /^\d+$/,
    //     language == "en"
    //       ? "Invalid Aadhaar number. It should contain only numbers."
    //       : "अवैध आधार क्रमांक. त्यात फक्त संख्या असावी."
    //   )
    //   .typeError(
    //     language == "en" ? "Invalid Aadhaar number" : "अवैध आधार क्रमांक"
    //   )
    //   .min(
    //     12,
    //     language == "en"
    //       ? "please enter valid aadhaar number"
    //       : "कृपया वैध आधार क्रमांक टाका"
    //   )
    //   .max(
    //     12,
    //     language == "en"
    //       ? "please enter valid aadhaar number"
    //       : "कृपया वैध आधार क्रमांक टाका"
    //   )
    //   .typeError(
    //     language == "en"
    //       ? "please enter valid aadhaar number"
    //       : "कृपया वैध आधार क्रमांक टाका"
    //   ),
  });
};

// PropertyAndWaterTaxesValidation
export let PropertyAndWaterTaxesValidation = (language) => {
  return yup.object().shape({
    // // propertyTaxNumber: yup
    // //   .string()
    // //   .matches(
    // //     /^[0-9]+$/,
    // //     language == "en"
    // //       ? "only numbers are allowed"
    // //       : "फक्त संख्यांना परवानगी आहे",
    // //   )
    // //   .required(<FormattedLabel id='propertyTaxNumberValidation' />),

    // // propertyTaxNumber
    // propertyTaxNumber: yup
    //   .string()
    //   .nullable()
    //   .test(
    //     "is-valid",
    //     language == "en"
    //       ? "only numbers are allowed"
    //       : "फक्त संख्यांना परवानगी आहे",
    //     (value) => {
    //       if (!value) return true;
    //       return /^\d+(\.\d+)?$/.test(value);
    //     }
    //   )
    //   .typeError(
    //     language == "en"
    //       ? "only numbers are allowed"
    //       : "फक्त संख्यांना परवानगी आहे"
    //   ),

    // // proprtyAmount: yup
    // //   .string()
    // //   .required(<FormattedLabel id='proprtyTaxAmountNumberValidation' />)
    // //   .matches(
    // //     /^[0-9]+$/,
    // //     language == "en"
    // //       ? "only numbers are allowed"
    // //       : "फक्त संख्यांना परवानगी आहे",
    // //   )
    // //   .typeError(),

    // // proprtyAmount
    // proprtyAmount: yup
    //   .string()
    //   .nullable()
    //   .test(
    //     "is-valid",
    //     language == "en"
    //       ? "only numbers are allowed"
    //       : "फक्त संख्यांना परवानगी आहे",
    //     (value) => {
    //       if (!value) return true;
    //       return /^\d+(\.\d+)?$/.test(value);
    //     }
    //   )
    //   .typeError(
    //     language == "en"
    //       ? "only numbers are allowed"
    //       : "फक्त संख्यांना परवानगी आहे"
    //   ),

    // // waterConsumerNo: yup
    // //   .string()
    // //   .matches(
    // //     /^[0-9]+$/,
    // //     language == "en"
    // //       ? "only numbers are allowed"
    // //       : "फक्त संख्यांना परवानगी आहे",
    // //   )
    // //   .required(<FormattedLabel id='waterConsumerNoValidation' />),

    // // waterConsumerNo
    // waterConsumerNo: yup
    //   .string()
    //   .nullable()
    //   .test(
    //     "is-valid",
    //     language == "en"
    //       ? "only numbers are allowed"
    //       : "फक्त संख्यांना परवानगी आहे",
    //     (value) => {
    //       if (!value) return true;
    //       return /^\d+(\.\d+)?$/.test(value);
    //     }
    //   )
    //   .typeError(
    //     language == "en"
    //       ? "only numbers are allowed"
    //       : "फक्त संख्यांना परवानगी आहे"
    //   ),

    // // waterAmount: yup
    // //   .string()
    // //   .required(<FormattedLabel id="waterTaxAmountVa  lidation" />)
    // //   .matches(
    // //     /^[0-9]+$/,
    // //     language == "en"
    // //       ? "only numbers are allowed"
    // //       : "फक्त संख्यांना परवानगी आहे"
    // //   )
    // //   .typeError(),

    // // waterAmount
    // waterAmount: yup
    //   .string()
    //   .nullable()
    //   .test(
    //     "is-valid",
    //     language == "en"
    //       ? "only numbers are allowed"
    //       : "फक्त संख्यांना परवानगी आहे",
    //     (value) => {
    //       if (!value) return true;
    //       return /^\d+(\.\d+)?$/.test(value);
    //     }
    //   )
    //   .typeError(
    //     language == "en"
    //       ? "only numbers are allowed"
    //       : "फक्त संख्यांना परवानगी आहे"
    //   ),
  });
};

// BusinessDetailsSchema
export let BusinessDetailsSchema = (language, oldLicenseYNA, voterNameYNA) => {
  return yup.object().shape({
    // // // city survey no
    // citySurveyNo: yup
    //   .string()
    //   .required(<FormattedLabel id="citySurveyNoValdationA" />)
    //   .matches(
    //     /^[0-9]+$/,
    //     language == "en"
    //       ? "only numbers are allowed"
    //       : "फक्त संख्यांना परवानगी आहे"
    //   )
    //   .typeError(
    //     language == "en"
    //       ? "only numbers are allowed"
    //       : "फक्त संख्यांना परवानगी आहे"
    //   ),
    // // // Zone Name -Validation
    // zoneKey: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="zoneNameValidation" />),
    // // // wardName,
    // wardName: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="wardNameValidation" />),
    // // // Area Name
    // areaName: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="areaNameValidation" />),
    // // // VillageName - road Name
    // villageName: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="roadNameValidation" />),
    // // // LandmarkName
    // landmarkName: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="landmarkNameValidation" />),
    // //  // cityName
    // cityName: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="cityNameValidation" />),
    // //  // state
    // state: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="stateNameValidation" />),
    // //  // pincode
    // pincode: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="pinCodeValidation" />),
    // // // hawkingZoneName
    // hawkingZoneName: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="hawkingZoneNameValidation" />),
    // // // hawkerType
    // hawkerType: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="hawkerTypeValidation" />),
    // // // natureOfBusiness
    // natureOfBusiness: yup
    //   .string().nullable()
    //   .matches(
    //     /^[^\s\d]+(?:\s[^\s\d]+)*$/,
    //     language == "en"
    //       ? "please enter valid nature of business name"
    //       : "कृपया व्यवसाय नावाचे वैध स्वरूप प्रविष्ट करा"
    //   )
    //   .required(<FormattedLabel id="natureOfBusinessValidation" />),
    // //  // hawkingDurationDaily
    // hawkingDurationDaily: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="hawkingDurationDailyValidation" />),
    // // // hawkerMode
    // hawkerMode: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="streetvendorModeNameValidation" />),
    // //  // item
    // item: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="itemValidation" />),

    // // // oldLicenseYN
    // oldLicenseYN: yup
    //   .boolean()
    //   .nullable()
    //   .required(<FormattedLabel id="oldLicenseYNValidation" />)
    //   .typeError(<FormattedLabel id="oldLicenseYNValidation" />),

    // //  // oldLicenseNo
    // oldLicenseNo: yup.string().when(["oldLicenseYNA"], {
    //   is: (oldLicenseYNA) => oldLicenseYNA === true,
    //   then: yup
    //     .string()
    //     .matches(
    //       /^[0-9]+$/,
    //       language == "en"
    //         ? "only numbers are allowed"
    //         : "फक्त संख्यांना परवानगी आहे"
    //     )
    //     .required(<FormattedLabel id="oldLicenseNoValidation" />),
    //   otherwise: yup.string().nullable(),
    // }),

    // ////oldLicenseDate
    // oldLicenseDate: yup.string().when(["oldLicenseYNA"], {
    //   is: (oldLicenseYNA) => oldLicenseYNA === true,
    //   then: yup
    //     .string()
    //     .nullable()
    //     .typeError(
    //       "old license date is required/जुनी परवाना तारीख आवश्यक आहे !!!"
    //     )
    //     .required(<FormattedLabel id="oldLicenseDateValidation" />),
    //   otherwise: yup.string().nullable(),
    // }),

    // // // education
    // education: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="educationValidation" />),

    // // // voterNameYN
    // voterNameYN: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="voterNameYNValidation" />),

    // //  // voterId
    // voterId: yup.string().when(["voterNameYNA"], {
    //   is: (voterNameYNA) => voterNameYNA === true,
    //   then: yup
    //     .string()
    //     .matches(
    //       /^[0-9]+$/,
    //       language == "en"
    //         ? "only numbers are allowed"
    //         : "फक्त संख्यांना परवानगी आहे"
    //     )
    //     .required(<FormattedLabel id="voterIdValidation" />),
    //   otherwise: yup.string().nullable(),
    // }),

    // //  // bankMaster
    // bankMaster: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="bankMasterValidation" />),

    // //  // branchName
    // branchName: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="branchNameValidation" />),
    // // // bankAccountNo
    // bankAccountNo: yup
    //   .string()
    //   .required(<FormattedLabel id="bankAccountNoValidation" />)
    //   .matches(
    //     /^[0-9]+$/,
    //     language === "en"
    //       ? "Invalid bank account number. Only numbers are allowed."
    //       : "अवैध बँक खाते क्रमांक. फक्त संख्यांना परवानगी आहे."
    //   )
    //   .min(
    //     9,
    //     language == "en"
    //       ? "please enter valid bank account number"
    //       : "कृपया वैध बँक खाते क्रमांक प्रविष्ट करा"
    //   )
    //   .max(
    //     18,
    //     language == "en"
    //       ? "please enter valid bank account number"
    //       : "कृपया वैध बँक खाते क्रमांक प्रविष्ट करा"
    //   )
    //   .typeError(
    //     language === "en"
    //       ? "Invalid bank account number. Only numbers are allowed."
    //       : "अवैध बँक खाते क्रमांक. फक्त संख्यांना परवानगी आहे."
    //   ),
    // // //ifscCode
    // ifscCode: yup
    //   .string()
    //   .required(
    //     language === "en" ? "IFSC code is required" : "आयफएससी कोड आवश्यक आहे"
    //   )
    //   .matches(
    //     /^[A-Z]{4}\d{7}$/,
    //     language === "en"
    //       ? "Invalid IFSC code. Please enter a valid IFSC code."
    //       : "अवैध आयफएससी कोड. कृपया एक वैध आयफएससी कोड प्रविष्ट करा."
    //   )
    //   .min(
    //     11,
    //     language === "en"
    //       ? "Invalid IFSC code. Please enter a valid 11-character IFSC code."
    //       : "अवैध आयफएससी कोड. कृपया एक वैध 11-अक्षरी आयफएससी कोड प्रविष्ट करा."
    //   )
    //   .max(
    //     11,
    //     language === "en"
    //       ? "Invalid IFSC code. Please enter a valid 11-character IFSC code."
    //       : "अवैध आयफएससी कोड. कृपया एक वैध 11-अक्षरी आयफएससी कोड प्रविष्ट करा."
    //   )
    //   .typeError(
    //     language === "en" ? "Invalid IFSC code." : "अवैध आयफएससी कोड."
    //   ),

    // // // hawkerLattitude
    // hawkerLattitude: yup
    //   .string()
    //   .nullable()
    //   .test(
    //     "is-valid",
    //     language == "en"
    //       ? "only numbers are allowed"
    //       : "फक्त संख्यांना परवानगी आहे",
    //     (value) => {
    //       if (!value) return true;
    //       return /^\d+(\.\d+)?$/.test(value);
    //     }
    //   )
    //   .typeError(
    //     language == "en"
    //       ? "only numbers are allowed"
    //       : "फक्त संख्यांना परवानगी आहे"
    //   ),

    // // // hawkerDetailsLogitude

    // hawkerDetailsLogitude: yup
    //   .string()
    //   .nullable()
    //   .test(
    //     "is-valid",
    //     language == "en"
    //       ? "only numbers are allowed"
    //       : "फक्त संख्यांना परवानगी आहे",
    //     (value) => {
    //       if (!value) return true;
    //       return /^\d+(\.\d+)?$/.test(value);
    //     }
    //   )
    //   .typeError(
    //     language == "en"
    //       ? "only numbers are allowed"
    //       : "फक्त संख्यांना परवानगी आहे"
    //   ),

    // //  // period of residense in maharashtra
    // periodOfResidenceInMaharashtraMonth: yup
    //   .string()
    //   .nullable()
    //   .required(
    //     language === "en"
    //       ? "period of residence in maharashtra in months is required !!!"
    //       : "महाराष्ट्रात राहण्याचा कालावधी महिन्यांत आवश्यक!!!"
    //   )
    //   .matches(
    //     /^[1-9]\d*$/,
    //     language === "en"
    //       ? "Only numbers are allowed"
    //       : "फक्त संख्यांना परवानगी आहे"
    //   )
    //   .min(
    //     1,
    //     language === "en"
    //       ? "Please enter valid months"
    //       : "कृपया वैध महिने प्रविष्ट करा"
    //   )
    //   .max(
    //     3,
    //     language === "en"
    //       ? "Please enter valid months"
    //       : "कृपया वैध महिने प्रविष्ट करा"
    //   ),
    // // // period of residense in pune
    // periodOfResidenceInPCMCMonth: yup
    //   .string()
    //   .nullable()
    //   .required(
    //     language === "en"
    //       ? "period of residence in pcmc in months is required !!!"
    //       : "pcmc मध्ये राहण्याचा कालावधी महिन्यांत आवश्यक आहे !!!"
    //   )
    //   .matches(
    //     /^[1-9]\d*$/,
    //     language === "en"
    //       ? "Only numbers are allowed"
    //       : "फक्त संख्यांना परवानगी आहे"
    //   )
    //   .min(
    //     1,
    //     language === "en"
    //       ? "Please enter valid months"
    //       : "कृपया वैध महिने प्रविष्ट करा"
    //   )
    //   .max(
    //     3,
    //     language === "en"
    //       ? "Please enter valid months"
    //       : "कृपया वैध महिने प्रविष्ट करा"
    //   )
    //   .test({
    //     name: "comparePeriods",
    //     test: function (value) {
    //       const pcmcMonths = parseInt(value);
    //       const maharashtraMonths = parseInt(
    //         this.parent.periodOfResidenceInMaharashtraMonth
    //       );
    //       return pcmcMonths <= maharashtraMonths;
    //     },
    //     message:
    //       language === "en"
    //         ? "PCMC Month should not be greater than Maharashtra Month"
    //         : "PCMC मधील महिने हे महाराष्ट्र महिन्यांपेक्षा जास्त नसावे",
    //   }),
  });
};

// doucmentUpload
export let DocumentsUploadSchema = (language) => {
  return yup.object().shape({
    // //  //aadhaarCardPhoto
    // aadharPhoto: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="aadhaarCardPhotoValidation" />),
    // //  //panCardPhoto
    // panCardPhoto: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="panCardPhotoValidation" />),
    // // //rationCardPhoto
    // rationCardPhoto: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="rationCardPhotoValidation" />),
    // // //applicantPhoto
    // applicantPhoto: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="hawkerPhotoValidation" />),
    // // // chequeorPassbookPhoto
    // chequeorPassbookPhoto: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="chequeorPassbookPhotoValidation" />),
    // // // shopBusinessOldLicensePhoto
    // shopBusinessOldLicensePhoto: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="shopBusinessOldLicensePhotoValidation" />),
    // //  //disablityCertificatePhoto
    // // disablityCertificatePhoto: yup
    // //   .string()
    // //   .nullable()
    // //   .required(<FormattedLabel id="disablityCertificatePhotoValidation" />),
    // // //affidaviteOnRS100StampAttache
    // // affidaviteOnRS100StampAttache: yup
    // //   .string()
    // //   .nullable()
    // //   .required(
    // //     <FormattedLabel id='affidaviteOnRS100StampAttacheValidation' />,
    // //   ),
    // // otherDocumentPhoto
    // // otherDocumentPhoto: yup
    // //   .string()
    // //   .nullable()
    // //   .required(<FormattedLabel id='otherDocumentPhotoValidation' />),
  });
};

// // IssuanceOfHawkerLicenseCitizenSchema
// export let IssuanceOfHawkerLicenseCitizenSchema = (
//   language,
//   castOtherA,
//   castCategoryOtherA
// ) => {
//   return yup.object().shape({
//     //1
//     // // title
//     title: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="titleValidation" />),
//     // // firstName
//     firstName: yup
//       .string()
//       .required(<FormattedLabel id="firstNameValidation" />),
//     // // firstNameMr
//     firstNameMr: yup
//       .string()
//       .required(<FormattedLabel id="firstNameValidationMr" />)
//       .matches(
//         /^[\u0900-\u097F]+(?:\s+[\u0900-\u097F]+)*$/,
//         language == "en"
//           ? "only marathi words are allowed"
//           : "फक्त मराठी शब्दांना परवानगी आहे"
//       ),
//     //  // middleName
//     middleName: yup
//       .string()
//       .required(<FormattedLabel id="middleNameValidation" />),
//     //  // middleNameMr
//     middleNameMr: yup
//       .string()
//       .required(<FormattedLabel id="middleNameValidationMr" />)
//       .matches(
//         /^[\u0900-\u097F]+(?:\s+[\u0900-\u097F]+)*$/,
//         language == "en"
//           ? "only marathi words are allowed"
//           : "फक्त मराठी शब्दांना परवानगी आहे"
//       ),
//     //// LastName
//     lastName: yup.string().required(<FormattedLabel id="lastNameValidation" />),
//     //// lastNameMr
//     lastNameMr: yup
//       .string()
//       .required(<FormattedLabel id="lastNameValidationMr" />)
//       .matches(
//         /^[\u0900-\u097F]+(?:\s+[\u0900-\u097F]+)*$/,
//         language == "en"
//           ? "only marathi words are allowed"
//           : "फक्त मराठी शब्दांना परवानगी आहे"
//       ),
//     //// gender
//     gender: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="genderValidation" />),
//     //// religion
//     religion: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="religionValidation" />),
//     //  // castt
//     castt: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="casteValidation" />),
//     // castOther
//     castOther: yup.string().when(["castt", "castOtherA"], {
//       is: (castt, castOtherA) =>
//         castOtherA && castt !== null && castt !== undefined && castt !== "",
//       then: yup.string().required(<FormattedLabel id="casteOtherValidation" />),
//       otherwise: yup.string().nullable(),
//     }),
//     // //// subCast
//     // subCast: yup
//     //   .string()
//     //   .nullable()
//     //   .required(<FormattedLabel id="subCasteValidation" />),
//     //// castCategory
//     castCategory: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="castCategoryValidation" />),

//     //  // castCategoryOther
//     castCategoryOther: yup
//       .string()
//       .when(["castCategory", "castCategoryOtherA"], {
//         is: (castCategory, castCategoryOtherA) =>
//           castCategoryOtherA &&
//           castCategory !== null &&
//           castCategory !== undefined &&
//           castCategory !== "",
//         then: yup
//           .string()
//           .required(<FormattedLabel id="casteCategoryOtherValidation" />),
//         otherwise: yup.string().nullable(),
//       }),
//     // //  Date of Birth
//     dateOfBirth: yup
//       .date()
//       .required(<FormattedLabel id="dateOfBirthValidation" />)
//       .typeError(
//         language == "en"
//           ? "date of birth is required"
//           : "जन्मतारीख आवश्यक आहे !!!"
//       ),
//     // // Age
//     age: yup
//       .number()
//       .required(<FormattedLabel id="ageValidation" />)
//       .min(
//         14,
//         language == "en"
//           ? "age must be at least 14 year"
//           : "वय किमान १४ वर्षे असावे"
//       )
//       .max(
//         99,
//         language == "en"
//           ? "age is not valid above 99"
//           : "वय 99 च्या वर वैध नाही "
//       )
//       .typeError(<FormattedLabel id="ageValidation" />),
//     //  // Mobile
//     mobile: yup
//       .string()
//       .required(<FormattedLabel id="mobileNovalidation" />)
//       .matches(
//         /^[6-9]\d{9}$/,
//         language == "en" ? "Invalid mobile number" : "अवैध मोबाईल नंबर"
//       )
//       .min(
//         10,
//         language == "en"
//           ? "mobile number must be at least 10 number"
//           : "मोबाईल क्रमांक किमान 10 अंकी असावा"
//       )
//       .max(
//         10,
//         language == "en"
//           ? " mobile number is  not valid above 10 number"
//           : "मोबाईल नंबर 10 अंकीवर वैध नाही"
//       )
//       .typeError(
//         language == "en" ? "Invalid mobile number" : "अवैध मोबाईल नंबर"
//       ),
//     //   // emailaddress
//     emailAddress: yup
//       .string()
//       .required(<FormattedLabel id="emailIdValidation" />)
//       .email(
//         language == "en"
//           ? "please enter valid email address"
//           : "कृपया वैध ई-मेल पत्ता प्रविष्ट करा"
//       )
//       .typeError(),
//     // // rationcardno
//     rationCardNo: yup
//       .string()
//       .required(<FormattedLabel id="rationCardNoValidation" />)
//       .matches(
//         /^[0-9]+$/,
//         language == "en"
//           ? "only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे"
//       )
//       .min(
//         12,
//         language == "en"
//           ? "please enter valid ration card number !!!"
//           : "कृपया वैध शिधापत्रिका क्रमांक प्रविष्ट करा !!!"
//       )
//       .max(
//         12,
//         language == "en"
//           ? "please enter valid ration card number !!!"
//           : "कृपया वैध शिधापत्रिका क्रमांक प्रविष्ट करा !!!"
//       )
//       .typeError(),
//     //  // applicant Type
//     applicantType: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="applicantTypeValidation" />),

//     applicantTypeOther: yup.string().when(["applicantType", "applicantTypeOtherA"], {
//       is: (applicantType, applicantTypeOtherA) =>
//         applicantTypeOtherA &&
//         (applicantType != null ||
//           (applicantType != undefined &&
//             applicantType != "" &&
//             applicantType != "false")),
//       then: yup
//         .string()
//         .required(<FormattedLabel id="typeOfDisabilityValidation" />),
//       otherwise: yup.string().nullable(),
//     }),

//     // // applicant type other
//     // // disblityNameYesNo
//     disablityNameYN: yup
//       .boolean()
//       .nullable()
//       .required(<FormattedLabel id="applicantTypeValidation" />)
//       .typeError(<FormattedLabel id="applicantTypeValidation" />),

//     //  // typeOfDisability
//     typeOfDisability: yup
//       .string()
//       .when(["disablityNameYN", "disablityNameYNA"], {
//         is: (disablityNameYN, disablityNameYNA) =>
//           disablityNameYNA &&
//           disablityNameYN !== null &&
//           disablityNameYN !== undefined &&
//           disablityNameYN !== "" &&
//           disablityNameYN != "false",
//         then: yup
//           .string()
//           .required(<FormattedLabel id="typeOfDisabilityValidation" />),
//         otherwise: yup.string().nullable(),
//       }),

//     //! 2
//     //  // cr  city survey number
//     crCitySurveyNumber: yup
//       .string()
//       .required(<FormattedLabel id="citySurveyNoValdationA" />)
//       .matches(
//         /^[0-9]+$/,
//         language == "en"
//           ? "only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे"
//       )
//       .typeError(),
//     // // pr city survey number
//     prCitySurveyNumber: yup
//       .string()
//       .required(<FormattedLabel id="citySurveyNoValdationA" />)
//       .matches(
//         /^[0-9]+$/,
//         language == "en"
//           ? "only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे"
//       )
//       .typeError(),
//     //// crZoneKey
//     crZoneKey: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="zoneNameValidation" />),
//     ////prZoneKey
//     prZoneKey: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="zoneNameValidation" />),
//     //// crWardName
//     crWardName: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="wardNameValidation" />),
//     ////  prWardName
//     prWardName: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="wardNameValidation" />),
//     // // crAreaName
//     crAreaName: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="areaNameValidation" />),
//     //  // prAreaName
//     prAreaName: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="areaNameValidation" />),
//     // // crLandmarkName
//     crLandmarkName: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="landmarkNameValidation" />),
//     //   // prLandmarkName
//     prLandmarkName: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="landmarkNameValidation" />),
//     // // crVillageName
//     crVillageName: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="roadNameValidation" />),
//     // // prVillageName
//     prVillageName: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="roadNameValidation" />),
//     //  // crCityName
//     crCityName: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="cityNameValidation" />),
//     //  // prCityName
//     prCityName: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="cityNameValidation" />),
//     //  // crState
//     crState: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="stateNameValidation" />),
//     //  // prState
//     prState: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="stateNameValidation" />),
//     //  // crPinCode
//     crPincode: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="pinCodeValidation" />),
//     //  // prPincode
//     prPincode: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="pinCodeValidation" />),
//     //  // crLattitude
//     crLattitude: yup
//       .string()
//       .nullable()
//       .test(
//         "is-valid",
//         language == "en"
//           ? "only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे",
//         (value) => {
//           if (!value) return true;
//           return /^\d+(\.\d+)?$/.test(value);
//         }
//       )
//       .typeError(
//         language == "en"
//           ? "only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे"
//       ),
//     //  // prLattitude
//     prLattitude: yup
//       .string()
//       .nullable()
//       .test(
//         "is-valid",
//         language == "en"
//           ? "only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे",
//         (value) => {
//           if (!value) return true;
//           return /^\d+(\.\d+)?$/.test(value);
//         }
//       )
//       .typeError(
//         language == "en"
//           ? "only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे"
//       ),

//     //  // crLogitude
//     crLogitude: yup
//       .string()
//       .nullable()
//       .test(
//         "is-valid",
//         language == "en"
//           ? "only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे",
//         (value) => {
//           if (!value) return true;
//           return /^\d+(\.\d+)?$/.test(value);
//         }
//       )
//       .typeError(
//         language == "en"
//           ? "only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे"
//       ),

//     // // prLogitude
//     prLogitude: yup
//       .string()
//       .nullable()
//       .test(
//         "is-valid",
//         language == "en"
//           ? "only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे",
//         (value) => {
//           if (!value) return true;
//           return /^\d+(\.\d+)?$/.test(value);
//         }
//       )
//       .typeError(
//         language == "en"
//           ? "only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे"
//       ),

//     //!3
//     aadhaarNo: yup
//       .string()
//       .required(<FormattedLabel id="aadharNumberValidation" />)
//       .matches(
//         /^[2-9]\d{11}$/,
//         language == "en" ? "Invalid Aadhaar number" : "अवैध आधार क्रमांक"
//       )
//       .matches(
//         /^\d+$/,
//         language == "en"
//           ? "Invalid Aadhaar number. It should contain only numbers."
//           : "अवैध आधार क्रमांक. त्यात फक्त संख्या असावी."
//       )
//       .typeError(
//         language == "en" ? "Invalid Aadhaar number" : "अवैध आधार क्रमांक"
//       )
//       .min(
//         12,
//         language == "en"
//           ? "please enter valid aadhaar number"
//           : "कृपया वैध आधार क्रमांक टाका"
//       )
//       .max(
//         12,
//         language == "en"
//           ? "please enter valid aadhaar number"
//           : "कृपया वैध आधार क्रमांक टाका"
//       )
//       .typeError(
//         language == "en"
//           ? "please enter valid aadhaar number"
//           : "कृपया वैध आधार क्रमांक टाका"
//       ),

//     //! 4
//     // // city survey no
//     citySurveyNo: yup
//       .string()
//       .required(<FormattedLabel id="citySurveyNoValdationA" />)
//       .matches(
//         /^[0-9]+$/,
//         language == "en"
//           ? "only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे"
//       )
//       .typeError(
//         language == "en"
//           ? "only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे"
//       ),
//     // // Zone Name -Validation
//     zoneKey: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="zoneNameValidation" />),
//     // // wardName,
//     wardName: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="wardNameValidation" />),
//     // // Area Name
//     areaName: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="areaNameValidation" />),
//     // // VillageName - road Name
//     villageName: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="roadNameValidation" />),
//     // // LandmarkName
//     landmarkName: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="landmarkNameValidation" />),
//     //  // cityName
//     cityName: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="cityNameValidation" />),
//     //  // state
//     state: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="stateNameValidation" />),
//     //  // pincode
//     pincode: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="pinCodeValidation" />),
//     // // hawkingZoneName
//     hawkingZoneName: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="hawkingZoneNameValidation" />),
//     // // hawkerType
//     hawkerType: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="hawkerTypeValidation" />),
//     // // natureOfBusiness
//     natureOfBusiness: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="natureOfBusinessValidation" />),
//     //  // hawkingDurationDaily
//     hawkingDurationDaily: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="hawkingDurationDailyValidation" />),
//     // // hawkerMode
//     hawkerMode: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="streetvendorModeNameValidation" />),
//     //  // item
//     item: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="itemValidation" />),
//     // // oldLicenseNo
//     // oldLicenseNo: yup
//     //   .string()
//     //   .required(<FormattedLabel id='oldLicenseNoValidation' />),
//     // // oldLicenseDate
//     // oldLicenseDate: yup
//     //   .date()
//     //   .required(<FormattedLabel id="oldLicenseDateValidation" />)
//     //   .typeError("old license date is required/जुनी परवाना तारीख आवश्यक आहे !!!"),
//     // // education
//     education: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="educationValidation" />),
//     //  // areaOfStreetvendor
//     // areaOfStreetvendor: yup
//     //   .string()
//     //   .required(<FormattedLabel id='areaOfStreetvendorValidation' />),
//     // // voterNameYN
//     voterNameYN: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="voterNameYNValidation" />),
//     //  // voterId
//     // voterId: yup.string().required(<FormattedLabel id="voterIdValidation" />),
//     //  // bankMaster
//     bankMaster: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="bankMasterValidation" />),
//     //  // branchName
//     branchName: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="branchNameValidation" />),
//     // // bankAccountNo
//     bankAccountNo: yup
//       .string()
//       .required(<FormattedLabel id="bankAccountNoValidation" />)
//       .matches(
//         /^[0-9]+$/,
//         language === "en"
//           ? "Invalid bank account number. Only numbers are allowed."
//           : "अवैध बँक खाते क्रमांक. फक्त संख्यांना परवानगी आहे."
//       )
//       .min(
//         9,
//         language == "en"
//           ? "please enter valid bank account number"
//           : "कृपया वैध बँक खाते क्रमांक प्रविष्ट करा"
//       )
//       .max(
//         18,
//         language == "en"
//           ? "please enter valid bank account number"
//           : "कृपया वैध बँक खाते क्रमांक प्रविष्ट करा"
//       )
//       .typeError(
//         language === "en"
//           ? "Invalid bank account number. Only numbers are allowed."
//           : "अवैध बँक खाते क्रमांक. फक्त संख्यांना परवानगी आहे."
//       ),
//     // //ifscCode
//     ifscCode: yup
//       .string()
//       .required(
//         language === "en" ? "IFSC code is required" : "आयफएससी कोड आवश्यक आहे"
//       )
//       .matches(
//         /^[A-Z]{4}\d{7}$/,
//         language === "en"
//           ? "Invalid IFSC code. Please enter a valid IFSC code."
//           : "अवैध आयफएससी कोड. कृपया एक वैध आयफएससी कोड प्रविष्ट करा."
//       )
//       .min(
//         11,
//         language === "en"
//           ? "Invalid IFSC code. Please enter a valid 11-character IFSC code."
//           : "अवैध आयफएससी कोड. कृपया एक वैध 11-अक्षरी आयफएससी कोड प्रविष्ट करा."
//       )
//       .max(
//         11,
//         language === "en"
//           ? "Invalid IFSC code. Please enter a valid 11-character IFSC code."
//           : "अवैध आयफएससी कोड. कृपया एक वैध 11-अक्षरी आयफएससी कोड प्रविष्ट करा."
//       )
//       .typeError(
//         language === "en" ? "Invalid IFSC code." : "अवैध आयफएससी कोड."
//       ),

//     // // hawkerLattitude
//     hawkerLattitude: yup
//       .string()
//       .nullable()
//       .test(
//         "is-valid",
//         language == "en"
//           ? "only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे",
//         (value) => {
//           if (!value) return true;
//           return /^\d+(\.\d+)?$/.test(value);
//         }
//       )
//       .typeError(
//         language == "en"
//           ? "only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे"
//       ),
//     // // hawkerDetailsLogitude

//     hawkerDetailsLogitude: yup
//       .string()
//       .nullable()
//       .test(
//         "is-valid",
//         language == "en"
//           ? "only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे",
//         (value) => {
//           if (!value) return true;
//           return /^\d+(\.\d+)?$/.test(value);
//         }
//       )
//       .typeError(
//         language == "en"
//           ? "only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे"
//       ),

//     //  // period of residense in maharashtra
//     periodOfResidenceInMaharashtraMonth: yup
//       .string()
//       .nullable()
//       .required(
//         language === "en"
//           ? "period of residence in maharashtra in months is required !!!"
//           : "महाराष्ट्रात राहण्याचा कालावधी महिन्यांत आवश्यक!!!"
//       )
//       .matches(
//         /^[1-9]\d*$/,
//         language === "en"
//           ? "Only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे"
//       )
//       .min(
//         1,
//         language === "en"
//           ? "Please enter valid months"
//           : "कृपया वैध महिने प्रविष्ट करा"
//       )
//       .max(
//         3,
//         language === "en"
//           ? "Please enter valid months"
//           : "कृपया वैध महिने प्रविष्ट करा"
//       ),
//     // // period of residense in pune
//     periodOfResidenceInPCMCMonth: yup
//       .string()
//       .nullable()
//       .required(
//         language === "en"
//           ? "period of residence in pcmc in months is required !!!"
//           : "pcmc मध्ये राहण्याचा कालावधी महिन्यांत आवश्यक आहे !!!"
//       )
//       .matches(
//         /^[1-9]\d*$/,
//         language === "en"
//           ? "Only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे"
//       )
//       .min(
//         1,
//         language === "en"
//           ? "Please enter valid months"
//           : "कृपया वैध महिने प्रविष्ट करा"
//       )
//       .max(
//         3,
//         language === "en"
//           ? "Please enter valid months"
//           : "कृपया वैध महिने प्रविष्ट करा"
//       )
//       .test({
//         name: "comparePeriods",
//         test: function (value) {
//           const pcmcMonths = parseInt(value);
//           const maharashtraMonths = parseInt(
//             this.parent.periodOfResidenceInMaharashtraMonth
//           );
//           return pcmcMonths <= maharashtraMonths;
//         },
//         message:
//           language === "en"
//             ? "PCMC Month should not be greater than Maharashtra Month"
//             : "PCMC मधील महिने हे महाराष्ट्र महिन्यांपेक्षा जास्त नसावे",
//       }),

//     //! 5

//     //  //aadhaarCardPhoto
//     aadharPhoto: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="aadhaarCardPhotoValidation" />),
//     //  //panCardPhoto
//     panCardPhoto: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="panCardPhotoValidation" />),
//     // //rationCardPhoto
//     rationCardPhoto: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="rationCardPhotoValidation" />),
//     // //applicantPhoto
//     applicantPhoto: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="hawkerPhotoValidation" />),
//     // // chequeorPassbookPhoto
//     chequeorPassbookPhoto: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="chequeorPassbookPhotoValidation" />),
//     // // shopBusinessOldLicensePhoto
//     shopBusinessOldLicensePhoto: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="shopBusinessOldLicensePhotoValidation" />),
//     //  //disablityCertificatePhoto
//     // disablityCertificatePhoto: yup
//     //   .string()
//     //   .nullable()
//     //   .required(<FormattedLabel id="disablityCertificatePhotoValidation" />),
//     // //affidaviteOnRS100StampAttache
//     // affidaviteOnRS100StampAttache: yup
//     //   .string()
//     //   .nullable()
//     //   .required(
//     //     <FormattedLabel id='affidaviteOnRS100StampAttacheValidation' />,
//     //   ),
//     // otherDocumentPhoto
//     // otherDocumentPhoto: yup
//     //   .string()
//     //   .nullable()
//     //   .required(<FormattedLabel id='otherDocumentPhotoValidation' />),
//   });
// };

// export let IssuanceOfHawkerLicenseCitizenSchema1 = (
//   language,
//   castOtherA,
//   castCategoryOtherA
// ) => {
//   return yup.object().shape({
//     //1
//     // // title
//     title: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="titleValidation" />),
//     // // firstName
//     firstName: yup
//       .string()
//       .required(<FormattedLabel id="firstNameValidation" />),
//     // // firstNameMr
//     firstNameMr: yup
//       .string()
//       .required(<FormattedLabel id="firstNameValidationMr" />)
//       .matches(
//         /^[\u0900-\u097F]+(?:\s+[\u0900-\u097F]+)*$/,
//         language == "en"
//           ? "only marathi words are allowed"
//           : "फक्त मराठी शब्दांना परवानगी आहे"
//       ),
//     //  // middleName
//     middleName: yup
//       .string()
//       .required(<FormattedLabel id="middleNameValidation" />),
//     //  // middleNameMr
//     middleNameMr: yup
//       .string()
//       .required(<FormattedLabel id="middleNameValidationMr" />)
//       .matches(
//         /^[\u0900-\u097F]+(?:\s+[\u0900-\u097F]+)*$/,
//         language == "en"
//           ? "only marathi words are allowed"
//           : "फक्त मराठी शब्दांना परवानगी आहे"
//       ),
//     //// LastName
//     lastName: yup.string().required(<FormattedLabel id="lastNameValidation" />),
//     //// lastNameMr
//     lastNameMr: yup
//       .string()
//       .required(<FormattedLabel id="lastNameValidationMr" />)
//       .matches(
//         /^[\u0900-\u097F]+(?:\s+[\u0900-\u097F]+)*$/,
//         language == "en"
//           ? "only marathi words are allowed"
//           : "फक्त मराठी शब्दांना परवानगी आहे"
//       ),
//     //// gender
//     gender: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="genderValidation" />),
//     //// religion
//     religion: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="religionValidation" />),
//     //  // castt
//     castt: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="casteValidation" />),
//     // castOther
//     castOther: yup.string().when(["castt", "castOtherA"], {
//       is: (castt, castOtherA) =>
//         castOtherA && castt !== null && castt !== undefined && castt !== "",
//       then: yup.string().required(<FormattedLabel id="casteOtherValidation" />),
//       otherwise: yup.string().nullable(),
//     }),
//     // //// subCast
//     // subCast: yup
//     //   .string()
//     //   .nullable()
//     //   .required(<FormattedLabel id="subCasteValidation" />),
//     //// castCategory
//     castCategory: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="castCategoryValidation" />),

//     //  // castCategoryOther
//     castCategoryOther: yup
//       .string()
//       .when(["castCategory", "castCategoryOtherA"], {
//         is: (castCategory, castCategoryOtherA) =>
//           castCategoryOtherA &&
//           castCategory !== null &&
//           castCategory !== undefined &&
//           castCategory !== "",
//         then: yup
//           .string()
//           .required(<FormattedLabel id="casteCategoryOtherValidation" />),
//         otherwise: yup.string().nullable(),
//       }),
//     // //  Date of Birth
//     dateOfBirth: yup
//       .date()
//       .required(<FormattedLabel id="dateOfBirthValidation" />)
//       .typeError(
//         language == "en"
//           ? "date of birth is required"
//           : "जन्मतारीख आवश्यक आहे !!!"
//       ),
//     // // Age
//     age: yup
//       .number()
//       .required(<FormattedLabel id="ageValidation" />)
//       .min(
//         14,
//         language == "en"
//           ? "age must be at least 14 year"
//           : "वय किमान १४ वर्षे असावे"
//       )
//       .max(
//         99,
//         language == "en"
//           ? "age is not valid above 99"
//           : "वय 99 च्या वर वैध नाही "
//       )
//       .typeError(<FormattedLabel id="ageValidation" />),
//     //  // Mobile
//     mobile: yup
//       .string()
//       .required(<FormattedLabel id="mobileNovalidation" />)
//       .matches(
//         /^[6-9]\d{9}$/,
//         language == "en" ? "Invalid mobile number" : "अवैध मोबाईल नंबर"
//       )
//       .min(
//         10,
//         language == "en"
//           ? "mobile number must be at least 10 number"
//           : "मोबाईल क्रमांक किमान 10 अंकी असावा"
//       )
//       .max(
//         10,
//         language == "en"
//           ? " mobile number is  not valid above 10 number"
//           : "मोबाईल नंबर 10 अंकीवर वैध नाही"
//       )
//       .typeError(
//         language == "en" ? "Invalid mobile number" : "अवैध मोबाईल नंबर"
//       ),
//     //   // emailaddress
//     emailAddress: yup
//       .string()
//       .required(<FormattedLabel id="emailIdValidation" />)
//       .email(
//         language == "en"
//           ? "please enter valid email address"
//           : "कृपया वैध ई-मेल पत्ता प्रविष्ट करा"
//       )
//       .typeError(),
//     // // rationcardno
//     rationCardNo: yup
//       .string()
//       .required(<FormattedLabel id="rationCardNoValidation" />)
//       .matches(
//         /^[A-Za-z0-9]{12}$/,
//         language == "en"
//           ? "please enter valid ration card number !!!"
//           : "कृपया वैध शिधापत्रिका क्रमांक प्रविष्ट करा !!!"
//       )
//       .min(
//         12,
//         language == "en"
//           ? "please enter valid ration card number !!!"
//           : "कृपया वैध शिधापत्रिका क्रमांक प्रविष्ट करा !!!"
//       )
//       .max(
//         12,
//         language == "en"
//           ? "please enter valid ration card number !!!"
//           : "कृपया वैध शिधापत्रिका क्रमांक प्रविष्ट करा !!!"
//       )
//       .typeError(),

//     //  // applicant Type
//     applicantType: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="applicantTypeValidation" />),

//     applicantTypeOther: yup.string().when(["applicantType", "applicantTypeOtherA"], {
//       is: (applicantType, applicantTypeOtherA) =>
//         applicantTypeOtherA &&
//         (applicantType != null ||
//           (applicantType != undefined &&
//             applicantType != "" &&
//             applicantType != "false")),
//       then: yup
//         .string()
//         .required(<FormattedLabel id="typeOfDisabilityValidation" />),
//       otherwise: yup.string().nullable(),
//     }),
//     // // disblityNameYesNo
//     // disablityNameYN: yup
//     //   .boolean()
//     //   .required(<FormattedLabel id='applicantTypeValidation' />),
//     // typeofdisability
//     // typeOfDisability: yup.string().when("disablityNameYN", {
//     //   is: true,
//     //   then: yup
//     //     .string()
//     //     // .nullable()
//     //     .required(<FormattedLabel id='typeOfDisabilityValidation' />),
//     // })

//     //! 2
//     //  // cr  city survey number
//     crCitySurveyNumber: yup
//       .string()
//       .required(<FormattedLabel id="citySurveyNoValdationA" />)
//       .matches(
//         /^[0-9]+$/,
//         language == "en"
//           ? "only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे"
//       )
//       .typeError(),
//     // // pr city survey number
//     prCitySurveyNumber: yup
//       .string()
//       .required(<FormattedLabel id="citySurveyNoValdationA" />)
//       .matches(
//         /^[0-9]+$/,
//         language == "en"
//           ? "only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे"
//       )
//       .typeError(),
//     //// crZoneKey
//     crZoneKey: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="zoneNameValidation" />),
//     ////prZoneKey
//     prZoneKeyT: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="zoneNameValidation" />),
//     //// crWardName
//     crWardName: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="wardNameValidation" />),
//     ////  prWardName
//     prWardNameT: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="wardNameValidation" />),
//     // // crAreaName
//     crAreaName: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="areaNameValidation" />),
//     //  // prAreaName
//     prAreaNameT: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="areaNameValidation" />),
//     // // crLandmarkName
//     crLandmarkName: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="landmarkNameValidation" />),
//     //   // prLandmarkName
//     prLandmarkNameT: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="landmarkNameValidation" />),
//     // // crVillageName
//     crVillageName: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="roadNameValidation" />),
//     // // prVillageName
//     prVillageNameT: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="roadNameValidation" />),
//     //  // crCityName
//     crCityName: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="cityNameValidation" />),
//     //  // prCityName
//     prCityName: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="cityNameValidation" />),
//     //  // crState
//     crState: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="stateNameValidation" />),
//     //  // prState
//     prState: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="stateNameValidation" />),
//     //  // crPinCode
//     crPincode: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="pinCodeValidation" />),
//     //  // prPincode
//     prPincodeT: yup
//       .string()
//       .required(<FormattedLabel id="pinCodeValidation" />)
//       .matches(
//         /^[0-9]+$/,
//         language === "en"
//           ? "Invalid PIN code. Only numbers are allowed."
//           : "अवैध पिन कोड. फक्त संख्यांना परवानगी आहे."
//       )
//       .min(
//         6,
//         language == "en"
//           ? "Invalid PIN code. Please enter a 6-digit number."
//           : "अवैध पिन कोड. कृपया 6-अंकी क्रमांक प्रविष्ट करा."
//       )
//       .max(
//         6,
//         language == "en"
//           ? "Invalid PIN code. Please enter a 6-digit number."
//           : "अवैध पिन कोड. कृपया 6-अंकी क्रमांक प्रविष्ट करा."
//       )
//       .typeError(
//         language === "en"
//           ? "Invalid PIN code. Only numbers are allowed."
//           : "अवैध पिन कोड. फक्त संख्यांना परवानगी आहे."
//       ),

//     //  // crLattitude
//     crLattitude: yup
//       .string()
//       .nullable()
//       .test(
//         "is-valid",
//         language == "en"
//           ? "only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे",
//         (value) => {
//           if (!value) return true;
//           return /^\d+(\.\d+)?$/.test(value);
//         }
//       )
//       .typeError(
//         language == "en"
//           ? "only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे"
//       ),
//     //  // prLattitude
//     prLattitude: yup
//       .string()
//       .nullable()
//       .test(
//         "is-valid",
//         language == "en"
//           ? "only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे",
//         (value) => {
//           if (!value) return true;
//           return /^\d+(\.\d+)?$/.test(value);
//         }
//       )
//       .typeError(
//         language == "en"
//           ? "only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे"
//       ),

//     //  // crLogitude
//     crLogitude: yup
//       .string()
//       .nullable()
//       .test(
//         "is-valid",
//         language == "en"
//           ? "only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे",
//         (value) => {
//           if (!value) return true;
//           return /^\d+(\.\d+)?$/.test(value);
//         }
//       )
//       .typeError(
//         language == "en"
//           ? "only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे"
//       ),

//     // // prLogitude
//     prLogitude: yup
//       .string()
//       .nullable()
//       .test(
//         "is-valid",
//         language == "en"
//           ? "only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे",
//         (value) => {
//           if (!value) return true;
//           return /^\d+(\.\d+)?$/.test(value);
//         }
//       )
//       .typeError(
//         language == "en"
//           ? "only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे"
//       ),
//     //!3
//     aadhaarNo: yup
//       .string()
//       .required(<FormattedLabel id="aadharNumberValidation" />)
//       .matches(
//         /^[2-9]\d{11}$/,
//         language == "en"
//           ? "Invalid Aadhaar number. It should be a 12-digit number starting with a digit between 2 and 9."
//           : "अवैध आधार क्रमांक. ती 2 आणि 9 मधील अंकाने सुरू होणारी 12-अंकी संख्या असावी."
//       )
//       .matches(
//         /^\d+$/,
//         language == "en"
//           ? "Invalid Aadhaar number. It should contain only numbers."
//           : "अवैध आधार क्रमांक. त्यात फक्त संख्या असावी."
//       )
//       .typeError(
//         language == "en" ? "Invalid Aadhaar number" : "अवैध आधार क्रमांक"
//       )
//       .min(
//         12,
//         language == "en"
//           ? "please enter valid aadhaar number"
//           : "कृपया वैध आधार क्रमांक टाका"
//       )
//       .max(
//         12,
//         language == "en"
//           ? "please enter valid aadhaar number"
//           : "कृपया वैध आधार क्रमांक टाका"
//       )
//       .typeError(
//         language == "en"
//           ? "please enter valid aadhaar number"
//           : "कृपया वैध आधार क्रमांक टाका"
//       ),

//     //! 4
//     // // city survey no
//     citySurveyNo: yup
//       .string()
//       .required(<FormattedLabel id="citySurveyNoValdationA" />)
//       .matches(
//         /^[0-9]+$/,
//         language == "en"
//           ? "only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे"
//       )
//       .typeError(
//         language == "en"
//           ? "only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे"
//       ),
//     // // Zone Name -Validation
//     zoneKey: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="zoneNameValidation" />),
//     // // wardName,
//     wardName: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="wardNameValidation" />),
//     // // Area Name
//     areaName: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="areaNameValidation" />),
//     // // VillageName - road Name
//     villageName: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="roadNameValidation" />),
//     // // LandmarkName
//     landmarkName: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="landmarkNameValidation" />),
//     //  // cityName
//     cityName: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="cityNameValidation" />),
//     //  // state
//     state: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="stateNameValidation" />),
//     //  // pincode
//     pincode: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="pinCodeValidation" />),
//     // // hawkingZoneName
//     hawkingZoneName: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="hawkingZoneNameValidation" />),
//     // // hawkerType
//     hawkerType: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="hawkerTypeValidation" />),
//     // // natureOfBusiness
//     natureOfBusiness: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="natureOfBusinessValidation" />),
//     //  // hawkingDurationDaily
//     hawkingDurationDaily: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="hawkingDurationDailyValidation" />),
//     // // hawkerMode
//     hawkerMode: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="streetvendorModeNameValidation" />),
//     //  // item
//     item: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="itemValidation" />),
//     // // oldLicenseNo
//     // oldLicenseNo: yup
//     //   .string()
//     //   .required(<FormattedLabel id='oldLicenseNoValidation' />),
//     // // oldLicenseDate
//     // oldLicenseDate: yup
//     //   .date()
//     //   .required(<FormattedLabel id="oldLicenseDateValidation" />)
//     //   .typeError("old license date is required/जुनी परवाना तारीख आवश्यक आहे !!!"),
//     // // education
//     education: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="educationValidation" />),
//     //  // areaOfStreetvendor
//     // areaOfStreetvendor: yup
//     //   .string()
//     //   .required(<FormattedLabel id='areaOfStreetvendorValidation' />),
//     // // voterNameYN
//     voterNameYN: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="voterNameYNValidation" />),
//     //  // voterId
//     // voterId: yup.string().required(<FormattedLabel id="voterIdValidation" />),
//     //  // bankMaster
//     bankMaster: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="bankMasterValidation" />),
//     //  // branchName
//     branchName: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="branchNameValidation" />),
//     // // bankAccountNo
//     bankAccountNo: yup
//       .string()
//       .required(<FormattedLabel id="bankAccountNoValidation" />)
//       .matches(
//         /^[0-9]+$/,
//         language === "en"
//           ? "Invalid bank account number. Only numbers are allowed."
//           : "अवैध बँक खाते क्रमांक. फक्त संख्यांना परवानगी आहे."
//       )
//       .min(
//         9,
//         language == "en"
//           ? "please enter valid bank account number"
//           : "कृपया वैध बँक खाते क्रमांक प्रविष्ट करा"
//       )
//       .max(
//         18,
//         language == "en"
//           ? "please enter valid bank account number"
//           : "कृपया वैध बँक खाते क्रमांक प्रविष्ट करा"
//       )
//       .typeError(
//         language === "en"
//           ? "Invalid bank account number. Only numbers are allowed."
//           : "अवैध बँक खाते क्रमांक. फक्त संख्यांना परवानगी आहे."
//       ),
//     // //ifscCode
//     ifscCode: yup
//       .string()
//       .required(
//         language === "en" ? "IFSC code is required" : "आयफएससी कोड आवश्यक आहे"
//       )
//       .matches(
//         /^[A-Z]{4}\d{7}$/,
//         language === "en"
//           ? "Invalid IFSC code. Please enter a valid IFSC code."
//           : "अवैध आयफएससी कोड. कृपया एक वैध आयफएससी कोड प्रविष्ट करा."
//       )
//       .min(
//         11,
//         language === "en"
//           ? "Invalid IFSC code. Please enter a valid 11-character IFSC code."
//           : "अवैध आयफएससी कोड. कृपया एक वैध 11-अक्षरी आयफएससी कोड प्रविष्ट करा."
//       )
//       .max(
//         11,
//         language === "en"
//           ? "Invalid IFSC code. Please enter a valid 11-character IFSC code."
//           : "अवैध आयफएससी कोड. कृपया एक वैध 11-अक्षरी आयफएससी कोड प्रविष्ट करा."
//       )
//       .typeError(
//         language === "en" ? "Invalid IFSC code." : "अवैध आयफएससी कोड."
//       ),

//     // // hawkerLattitude
//     hawkerLattitude: yup
//       .string()
//       .nullable()
//       .test(
//         "is-valid",
//         language == "en"
//           ? "only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे",
//         (value) => {
//           if (!value) return true;
//           return /^\d+(\.\d+)?$/.test(value);
//         }
//       )
//       .typeError(
//         language == "en"
//           ? "only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे"
//       ),
//     // // hawkerDetailsLogitude

//     hawkerDetailsLogitude: yup
//       .string()
//       .nullable()
//       .test(
//         "is-valid",
//         language == "en"
//           ? "only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे",
//         (value) => {
//           if (!value) return true;
//           return /^\d+(\.\d+)?$/.test(value);
//         }
//       )
//       .typeError(
//         language == "en"
//           ? "only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे"
//       ),

//     //  // period of residense in maharashtra
//     periodOfResidenceInMaharashtraMonth: yup
//       .string()
//       .nullable()
//       .required(
//         language === "en"
//           ? "period of residence in maharashtra in months is required !!!"
//           : "महाराष्ट्रात राहण्याचा कालावधी महिन्यांत आवश्यक!!!"
//       )
//       .matches(
//         /^[1-9]\d*$/,
//         language === "en"
//           ? "Only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे"
//       )
//       .min(
//         1,
//         language === "en"
//           ? "Please enter valid months"
//           : "कृपया वैध महिने प्रविष्ट करा"
//       )
//       .max(
//         3,
//         language === "en"
//           ? "Please enter valid months"
//           : "कृपया वैध महिने प्रविष्ट करा"
//       ),
//     // // period of residense in pune
//     periodOfResidenceInPCMCMonth: yup
//       .string()
//       .nullable()
//       .required(
//         language === "en"
//           ? "period of residence in pcmc in months is required !!!"
//           : "pcmc मध्ये राहण्याचा कालावधी महिन्यांत आवश्यक आहे !!!"
//       )
//       .matches(
//         /^[1-9]\d*$/,
//         language === "en"
//           ? "Only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे"
//       )
//       .min(
//         1,
//         language === "en"
//           ? "Please enter valid months"
//           : "कृपया वैध महिने प्रविष्ट करा"
//       )
//       .max(
//         3,
//         language === "en"
//           ? "Please enter valid months"
//           : "कृपया वैध महिने प्रविष्ट करा"
//       )
//       .test({
//         name: "comparePeriods",
//         test: function (value) {
//           const pcmcMonths = parseInt(value);
//           const maharashtraMonths = parseInt(
//             this.parent.periodOfResidenceInMaharashtraMonth
//           );
//           return pcmcMonths <= maharashtraMonths;
//         },
//         message:
//           language === "en"
//             ? "PCMC Month should not be greater than Maharashtra Month"
//             : "PCMC मधील महिने हे महाराष्ट्र महिन्यांपेक्षा जास्त नसावे",
//       }),

//     //! 5

//     //  //aadhaarCardPhoto
//     aadharPhoto: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="aadhaarCardPhotoValidation" />),
//     //  //panCardPhoto
//     panCardPhoto: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="panCardPhotoValidation" />),
//     // //rationCardPhoto
//     rationCardPhoto: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="rationCardPhotoValidation" />),
//     // //applicantPhoto
//     applicantPhoto: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="hawkerPhotoValidation" />),
//     // // chequeorPassbookPhoto
//     chequeorPassbookPhoto: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="chequeorPassbookPhotoValidation" />),
//     // // shopBusinessOldLicensePhoto
//     shopBusinessOldLicensePhoto: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="shopBusinessOldLicensePhotoValidation" />),
//     //  //disablityCertificatePhoto
//     // disablityCertificatePhoto: yup
//     //   .string()
//     //   .nullable()
//     //   .required(<FormattedLabel id="disablityCertificatePhotoValidation" />),
//     // //affidaviteOnRS100StampAttache
//     // affidaviteOnRS100StampAttache: yup
//     //   .string()
//     //   .nullable()
//     //   .required(
//     //     <FormattedLabel id='affidaviteOnRS100StampAttacheValidation' />,
//     //   ),
//     // otherDocumentPhoto
//     // otherDocumentPhoto: yup
//     //   .string()
//     //   .nullable()
//     //   .required(<FormattedLabel id='otherDocumentPhotoValidation' />),
//   });
// };
