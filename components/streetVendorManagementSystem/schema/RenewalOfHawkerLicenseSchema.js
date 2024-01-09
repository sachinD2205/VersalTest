import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// RenewalOfHawkerLicenseSchema.
export let RenewalOfHawkerLicenseSchema = (
  language,
  castOtherA,
  castCategoryOtherA,
  disablityNameYN
) => {
  console.log("BhavaAahekaBara", language, castOtherA, castCategoryOtherA);
  return yup.object().shape({
    //1
    // // title
    title: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="titleValidation" />),
    // // firstName
    firstName: yup
      .string()
      .required(<FormattedLabel id="firstNameValidation" />),
    // // firstNameMr
    firstNameMr: yup
      .string()
      .required(<FormattedLabel id="firstNameValidationMr" />)
      .matches(
        /^[\u0900-\u097F]+(?:\s+[\u0900-\u097F]+)*$/,
        language == "en"
          ? "only marathi words are allowed"
          : "फक्त मराठी शब्दांना परवानगी आहे"
      ),
    //  // middleName
    middleName: yup
      .string()
      .required(<FormattedLabel id="middleNameValidation" />),
    //  // middleNameMr
    middleNameMr: yup
      .string()
      .required(<FormattedLabel id="middleNameValidationMr" />)
      .matches(
        /^[\u0900-\u097F]+(?:\s+[\u0900-\u097F]+)*$/,
        language == "en"
          ? "only marathi words are allowed"
          : "फक्त मराठी शब्दांना परवानगी आहे"
      ),
    //// LastName
    lastName: yup.string().required(<FormattedLabel id="lastNameValidation" />),
    //// lastNameMr
    lastNameMr: yup
      .string()
      .required(<FormattedLabel id="lastNameValidationMr" />)
      .matches(
        /^[\u0900-\u097F]+(?:\s+[\u0900-\u097F]+)*$/,
        language == "en"
          ? "only marathi words are allowed"
          : "फक्त मराठी शब्दांना परवानगी आहे"
      ),
    //// gender
    gender: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="genderValidation" />),
    //// religion
    religion: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="religionValidation" />),
    //  // castt
    castt: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="casteValidation" />),
    // castOther
    castOther: yup.string().when(["castt", "castOtherA"], {
      is: (castt, castOtherA) =>
        castOtherA && castt !== null && castt !== undefined && castt !== "",
      then: yup.string().required(<FormattedLabel id="casteOtherValidation" />),
      otherwise: yup.string().nullable(),
    }),
    // //// subCast
    // subCast: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="subCasteValidation" />),
    //// castCategory
    castCategory: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="castCategoryValidation" />),

    //  // castCategoryOther
    castCategoryOther: yup
      .string()
      .when(["castCategory", "castCategoryOtherA"], {
        is: (castCategory, castCategoryOtherA) =>
          castCategoryOtherA &&
          castCategory !== null &&
          castCategory !== undefined &&
          castCategory !== "",
        then: yup
          .string()
          .required(<FormattedLabel id="casteCategoryOtherValidation" />),
        otherwise: yup.string().nullable(),
      }),
    // //  Date of Birth
    dateOfBirth: yup
      .date()
      .required(<FormattedLabel id="dateOfBirthValidation" />)
      .typeError(
        language == "en"
          ? "date of birth is required"
          : "जन्मतारीख आवश्यक आहे !!!"
      ),
    // // Age
    age: yup
      .number()
      .required(<FormattedLabel id="ageValidation" />)
      .min(
        14,
        language == "en"
          ? "age must be at least 14 year"
          : "वय किमान १४ वर्षे असावे"
      )
      .max(
        99,
        language == "en"
          ? "age is not valid above 99"
          : "वय 99 च्या वर वैध नाही "
      )
      .typeError(<FormattedLabel id="ageValidation" />),
    //  // Mobile
    mobile: yup
      .string()
      .required(<FormattedLabel id="mobileNovalidation" />)
      .matches(
        /^[6-9]\d{9}$/,
        language == "en" ? "Invalid mobile number" : "अवैध मोबाईल नंबर"
      )
      .min(
        10,
        language == "en"
          ? "mobile number must be at least 10 number"
          : "मोबाईल क्रमांक किमान 10 अंकी असावा"
      )
      .max(
        10,
        language == "en"
          ? " mobile number is  not valid above 10 number"
          : "मोबाईल नंबर 10 अंकीवर वैध नाही"
      )
      .typeError(
        language == "en" ? "Invalid mobile number" : "अवैध मोबाईल नंबर"
      ),
    //   // emailaddress
    emailAddress: yup
      .string()
      .required(<FormattedLabel id="emailIdValidation" />)
      .email(
        language == "en"
          ? "please enter valid email address"
          : "कृपया वैध ई-मेल पत्ता प्रविष्ट करा"
      )
      .typeError(),
    // // rationcardno
    rationCardNo: yup
      .string()
      .required(<FormattedLabel id="rationCardNoValidation" />)
      .matches(
        /^[A-Za-z0-9]{12}$/,
        language == "en"
          ? "please enter valid ration card number !!!"
          : "कृपया वैध शिधापत्रिका क्रमांक प्रविष्ट करा !!!"
      )
      .min(
        12,
        language == "en"
          ? "please enter valid ration card number !!!"
          : "कृपया वैध शिधापत्रिका क्रमांक प्रविष्ट करा !!!"
      )
      .max(
        12,
        language == "en"
          ? "please enter valid ration card number !!!"
          : "कृपया वैध शिधापत्रिका क्रमांक प्रविष्ट करा !!!"
      )
      .typeError(),
    //  // applicantType
    applicantType: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="applicantTypeValidation" />),
    // // disblityNameYesNo
    // disablityNameYN: yup
    //   .boolean()
    //   .required(<FormattedLabel id='applicantTypeValidation' />),
    // typeofdisability
    // typeOfDisability: yup.string().when("disablityNameYN", {
    //   is: true,
    //   then: yup
    //     .string()
    //     // .nullable()
    //     .required(<FormattedLabel id='typeOfDisabilityValidation' />),
    // })

    //! 2
    //  // cr  city survey number
    crCitySurveyNumber: yup
      .string()
      .required(<FormattedLabel id="citySurveyNoValdationA" />)
      .matches(
        /^[0-9]+$/,
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      )
      .typeError(),
    // // pr city survey number
    prCitySurveyNumber: yup
      .string()
      .required(<FormattedLabel id="citySurveyNoValdationA" />)
      .matches(
        /^[0-9]+$/,
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      )
      .typeError(),
    //// crZoneKey
    crZoneKey: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="zoneNameValidation" />),
    ////prZoneKey
    prZoneKey: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="zoneNameValidation" />),
    //// crWardName
    crWardName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="wardNameValidation" />),
    ////  prWardName
    prWardName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="wardNameValidation" />),
    // // crAreaName
    crAreaName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="areaNameValidation" />),
    //  // prAreaName
    prAreaName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="areaNameValidation" />),
    // // crLandmarkName
    crLandmarkName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="landmarkNameValidation" />),
    //   // prLandmarkName
    prLandmarkName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="landmarkNameValidation" />),
    // // crVillageName
    crVillageName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="roadNameValidation" />),
    // // prVillageName
    prVillageName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="roadNameValidation" />),
    //  // crCityName
    crCityName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="cityNameValidation" />),
    //  // prCityName
    prCityName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="cityNameValidation" />),
    //  // crState
    crState: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="stateNameValidation" />),
    //  // prState
    prState: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="stateNameValidation" />),
    //  // crPinCode
    crPincode: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="pinCodeValidation" />),
    //  // prPincode
    prPincode: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="pinCodeValidation" />),
    //  // crLattitude
    crLattitude: yup
      .string()
      .nullable()
      .test(
        "is-valid",
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे",
        (value) => {
          if (!value) return true;
          return /^\d+(\.\d+)?$/.test(value);
        }
      )
      .typeError(
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      ),
    //  // prLattitude
    prLattitude: yup
      .string()
      .nullable()
      .test(
        "is-valid",
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे",
        (value) => {
          if (!value) return true;
          return /^\d+(\.\d+)?$/.test(value);
        }
      )
      .typeError(
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      ),

    //  // crLogitude
    crLogitude: yup
      .string()
      .nullable()
      .test(
        "is-valid",
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे",
        (value) => {
          if (!value) return true;
          return /^\d+(\.\d+)?$/.test(value);
        }
      )
      .typeError(
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      ),

    // // prLogitude
    prLogitude: yup
      .string()
      .nullable()
      .test(
        "is-valid",
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे",
        (value) => {
          if (!value) return true;
          return /^\d+(\.\d+)?$/.test(value);
        }
      )
      .typeError(
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      ),

    //!3
    aadhaarNo: yup
      .string()
      .required(<FormattedLabel id="aadharNumberValidation" />)
      .matches(
        /^[2-9]\d{11}$/,
        language == "en" ? "Invalid Aadhaar number" : "अवैध आधार क्रमांक"
      )
      .matches(
        /^\d+$/,
        language == "en"
          ? "Invalid Aadhaar number. It should contain only numbers."
          : "अवैध आधार क्रमांक. त्यात फक्त संख्या असावी."
      )
      .typeError(
        language == "en" ? "Invalid Aadhaar number" : "अवैध आधार क्रमांक"
      )
      .min(
        12,
        language == "en"
          ? "please enter valid aadhaar number"
          : "कृपया वैध आधार क्रमांक टाका"
      )
      .max(
        12,
        language == "en"
          ? "please enter valid aadhaar number"
          : "कृपया वैध आधार क्रमांक टाका"
      )
      .typeError(
        language == "en"
          ? "please enter valid aadhaar number"
          : "कृपया वैध आधार क्रमांक टाका"
      ),
    //! 4
    // // city survey no
    citySurveyNo: yup
      .string()
      .required(<FormattedLabel id="citySurveyNoValdationA" />)
      .matches(
        /^[0-9]+$/,
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      )
      .typeError(
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      ),
    // // Zone Name -Validation
    zoneKey: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="zoneNameValidation" />),
    // // wardName,
    wardName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="wardNameValidation" />),
    // // Area Name
    areaName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="areaNameValidation" />),
    // // VillageName - road Name
    villageName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="roadNameValidation" />),
    // // LandmarkName
    landmarkName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="landmarkNameValidation" />),
    //  // cityName
    cityName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="cityNameValidation" />),
    //  // state
    state: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="stateNameValidation" />),
    //  // pincode
    pincode: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="pinCodeValidation" />),
    // // hawkingZoneName
    hawkingZoneName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="hawkingZoneNameValidation" />),
    // // hawkerType
    hawkerType: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="hawkerTypeValidation" />),
    // // natureOfBusiness
    natureOfBusiness: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="natureOfBusinessValidation" />),
    //  // hawkingDurationDaily
    hawkingDurationDaily: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="hawkingDurationDailyValidation" />),
    // // hawkerMode
    hawkerMode: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="streetvendorModeNameValidation" />),
    //  // item
    item: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="itemValidation" />),
    // // oldLicenseNo
    // oldLicenseNo: yup
    //   .string()
    //   .required(<FormattedLabel id='oldLicenseNoValidation' />),
    // // oldLicenseDate
    // oldLicenseDate: yup
    //   .date()
    //   .required(<FormattedLabel id="oldLicenseDateValidation" />)
    //   .typeError("old license date is required/जुनी परवाना तारीख आवश्यक आहे !!!"),
    // // education
    education: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="educationValidation" />),
    //  // areaOfStreetvendor
    // areaOfStreetvendor: yup
    //   .string()
    //   .required(<FormattedLabel id='areaOfStreetvendorValidation' />),
    // // voterNameYN
    voterNameYN: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="voterNameYNValidation" />),
    //  // voterId
    // voterId: yup.string().required(<FormattedLabel id="voterIdValidation" />),
    //  // bankMaster
    bankMaster: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="bankMasterValidation" />),
    //  // branchName
    branchName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="branchNameValidation" />),
    // // bankAccountNo
    bankAccountNo: yup
      .string()
      .required(<FormattedLabel id="bankAccountNoValidation" />)
      .matches(
        /^[0-9]+$/,
        language === "en"
          ? "Invalid bank account number. Only numbers are allowed."
          : "अवैध बँक खाते क्रमांक. फक्त संख्यांना परवानगी आहे."
      )
      .min(
        9,
        language == "en"
          ? "please enter valid bank account number"
          : "कृपया वैध बँक खाते क्रमांक प्रविष्ट करा"
      )
      .max(
        18,
        language == "en"
          ? "please enter valid bank account number"
          : "कृपया वैध बँक खाते क्रमांक प्रविष्ट करा"
      )
      .typeError(
        language === "en"
          ? "Invalid bank account number. Only numbers are allowed."
          : "अवैध बँक खाते क्रमांक. फक्त संख्यांना परवानगी आहे."
      ),
    // //ifscCode
    ifscCode: yup
      .string()
      .required(
        language === "en" ? "IFSC code is required" : "आयएसएसी कोड आवश्यक आहे"
      )
      .matches(
        /^[A-Z]{4}\d{7}$/,
        language === "en"
          ? "Invalid IFSC code. Please enter a valid IFSC code."
          : "अवैध आयएसएसी कोड. कृपया एक वैध आयएसएसी कोड प्रविष्ट करा."
      )
      .min(
        11,
        language === "en"
          ? "Invalid IFSC code. Please enter a valid 11-character IFSC code."
          : "अवैध आयएसएसी कोड. कृपया एक वैध 11-अक्षरी आयएसएसी कोड प्रविष्ट करा."
      )
      .max(
        11,
        language === "en"
          ? "Invalid IFSC code. Please enter a valid 11-character IFSC code."
          : "अवैध आयएसएसी कोड. कृपया एक वैध 11-अक्षरी आयएसएसी कोड प्रविष्ट करा."
      )
      .typeError(
        language === "en" ? "Invalid IFSC code." : "अवैध आयएसएसी कोड."
      ),
    // // hawkerLattitude
    hawkerLattitude: yup
      .string()
      .nullable()
      .test(
        "is-valid",
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे",
        (value) => {
          if (!value) return true;
          return /^\d+(\.\d+)?$/.test(value);
        }
      )
      .typeError(
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      ),
    // // hawkerDetailsLogitude

    hawkerDetailsLogitude: yup
      .string()
      .nullable()
      .test(
        "is-valid",
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे",
        (value) => {
          if (!value) return true;
          return /^\d+(\.\d+)?$/.test(value);
        }
      )
      .typeError(
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      ),

    //  // period of residense in maharashtra
    periodOfResidenceInMaharashtraMonth: yup
      .string()
      .required(
        language === "en"
          ? "period of residence in maharashtra in months is required !!!"
          : "महाराष्ट्रात राहण्याचा कालावधी महिन्यांत आवश्यक!!!"
      )
      .matches(
        /^[1-9]\d*$/,
        language === "en"
          ? "Only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      )
      .min(
        1,
        language === "en"
          ? "Please enter valid months"
          : "कृपया वैध महिने प्रविष्ट करा"
      )
      .max(
        3,
        language === "en"
          ? "Please enter valid months"
          : "कृपया वैध महिने प्रविष्ट करा"
      ),
    // // period of residense in pune
    periodOfResidenceInPCMCMonth: yup
      .string()
      .required(
        language === "en"
          ? "period of residence in pcmc in months is required !!!"
          : "pcmc मध्ये राहण्याचा कालावधी महिन्यांत आवश्यक आहे !!!"
      )
      .matches(
        /^[1-9]\d*$/,
        language === "en"
          ? "Only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      )
      .min(
        1,
        language === "en"
          ? "Please enter valid months"
          : "कृपया वैध महिने प्रविष्ट करा"
      )
      .max(
        3,
        language === "en"
          ? "Please enter valid months"
          : "कृपया वैध महिने प्रविष्ट करा"
      )
      .test({
        name: "comparePeriods",
        test: function (value) {
          console.log(
            "value121212",
            value,
            this.parent.periodOfResidenceInMaharashtraMonth
          );
          const pcmcMonths = parseInt(value);
          const maharashtraMonths = parseInt(
            this.parent.periodOfResidenceInMaharashtraMonth
          );
          return pcmcMonths <= maharashtraMonths;
        },
        message:
          language === "en"
            ? "PCMC Month should not be greater than Maharashtra Month"
            : "PCMC मधील महिने हे महाराष्ट्र महिन्यांपेक्षा जास्त नसावे",
      }),

    //! 5

    //  //aadhaarCardPhoto
    aadharPhoto: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="aadhaarCardPhotoValidation" />),
    //  //panCardPhoto
    panCardPhoto: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="panCardPhotoValidation" />),
    // //rationCardPhoto
    rationCardPhoto: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="rationCardPhotoValidation" />),
    // //applicantPhoto
    applicantPhoto: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="hawkerPhotoValidation" />),
    // // chequeorPassbookPhoto
    chequeorPassbookPhoto: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="chequeorPassbookPhotoValidation" />),
    // // shopBusinessOldLicensePhoto
    shopBusinessOldLicensePhoto: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="shopBusinessOldLicensePhotoValidation" />),

    // // disablityCertificatepHoto
    disablityCertificatePhoto: yup.string().when(["disablityNameYN"], {
      is: (disablityNameYN) => {
        console.log("AGER", disablityNameYN, disablityNameYN === "true")
        return disablityNameYN === "true"
      },
      then: yup
        .string()
        .nullable()
        .required(<FormattedLabel id="disablityCertificatePhotoValidation" />),
      otherwise: yup.string().nullable(),
    }),



    //  //disablityCertificatePhoto
    // disablityCertificatePhoto: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="disablityCertificatePhotoValidation" />),
    // //affidaviteOnRS100StampAttache
    // affidaviteOnRS100StampAttache: yup
    //   .string()
    //   .nullable()
    //   .required(
    //     <FormattedLabel id='affidaviteOnRS100StampAttacheValidation' />,
    //   ),
    // otherDocumentPhoto
    // otherDocumentPhoto: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id='otherDocumentPhotoValidation' />),
  });
};

export let RenewalOfHawkerLicenseSchema1 = (
  language,
  castOtherA,
  castCategoryOtherA,
  disablityNameYN
) => {
  console.log("BhavaAahekaBara", language, castOtherA, castCategoryOtherA);
  return yup.object().shape({
    //1
    // // title
    title: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="titleValidation" />),
    // // firstName
    firstName: yup
      .string()
      .required(<FormattedLabel id="firstNameValidation" />),
    // // firstNameMr
    firstNameMr: yup
      .string()
      .required(<FormattedLabel id="firstNameValidationMr" />)
      .matches(
        /^[\u0900-\u097F]+(?:\s+[\u0900-\u097F]+)*$/,
        language == "en"
          ? "only marathi words are allowed"
          : "फक्त मराठी शब्दांना परवानगी आहे"
      ),
    //  // middleName
    middleName: yup
      .string()
      .required(<FormattedLabel id="middleNameValidation" />),
    //  // middleNameMr
    middleNameMr: yup
      .string()
      .required(<FormattedLabel id="middleNameValidationMr" />)
      .matches(
        /^[\u0900-\u097F]+(?:\s+[\u0900-\u097F]+)*$/,
        language == "en"
          ? "only marathi words are allowed"
          : "फक्त मराठी शब्दांना परवानगी आहे"
      ),
    //// LastName
    lastName: yup.string().required(<FormattedLabel id="lastNameValidation" />),
    //// lastNameMr
    lastNameMr: yup
      .string()
      .required(<FormattedLabel id="lastNameValidationMr" />)
      .matches(
        /^[\u0900-\u097F]+(?:\s+[\u0900-\u097F]+)*$/,
        language == "en"
          ? "only marathi words are allowed"
          : "फक्त मराठी शब्दांना परवानगी आहे"
      ),
    //// gender
    gender: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="genderValidation" />),
    //// religion
    religion: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="religionValidation" />),
    //  // castt
    castt: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="casteValidation" />),
    // castOther
    castOther: yup.string().when(["castt", "castOtherA"], {
      is: (castt, castOtherA) =>
        castOtherA && castt !== null && castt !== undefined && castt !== "",
      then: yup.string().required(<FormattedLabel id="casteOtherValidation" />),
      otherwise: yup.string().nullable(),
    }),
    // //// subCast
    // subCast: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="subCasteValidation" />),
    //// castCategory
    castCategory: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="castCategoryValidation" />),

    //  // castCategoryOther
    castCategoryOther: yup
      .string()
      .when(["castCategory", "castCategoryOtherA"], {
        is: (castCategory, castCategoryOtherA) =>
          castCategoryOtherA &&
          castCategory !== null &&
          castCategory !== undefined &&
          castCategory !== "",
        then: yup
          .string()
          .required(<FormattedLabel id="casteCategoryOtherValidation" />),
        otherwise: yup.string().nullable(),
      }),
    // //  Date of Birth
    dateOfBirth: yup
      .date()
      .required(<FormattedLabel id="dateOfBirthValidation" />)
      .typeError(
        language == "en"
          ? "date of birth is required"
          : "जन्मतारीख आवश्यक आहे !!!"
      ),
    // // Age
    age: yup
      .number()
      .required(<FormattedLabel id="ageValidation" />)
      .min(
        14,
        language == "en"
          ? "age must be at least 14 year"
          : "वय किमान १४ वर्षे असावे"
      )
      .max(
        99,
        language == "en"
          ? "age is not valid above 99"
          : "वय 99 च्या वर वैध नाही "
      )
      .typeError(<FormattedLabel id="ageValidation" />),
    //  // Mobile
    mobile: yup
      .string()
      .required(<FormattedLabel id="mobileNovalidation" />)
      .matches(
        /^[6-9]\d{9}$/,
        language == "en" ? "Invalid mobile number" : "अवैध मोबाईल नंबर"
      )
      .min(
        10,
        language == "en"
          ? "mobile number must be at least 10 number"
          : "मोबाईल क्रमांक किमान 10 अंकी असावा"
      )
      .max(
        10,
        language == "en"
          ? " mobile number is  not valid above 10 number"
          : "मोबाईल नंबर 10 अंकीवर वैध नाही"
      )
      .typeError(
        language == "en" ? "Invalid mobile number" : "अवैध मोबाईल नंबर"
      ),
    //   // emailaddress
    emailAddress: yup
      .string()
      .required(<FormattedLabel id="emailIdValidation" />)
      .email(
        language == "en"
          ? "please enter valid email address"
          : "कृपया वैध ई-मेल पत्ता प्रविष्ट करा"
      )
      .typeError(),
    // // rationcardno
    rationCardNo: yup
      .string()
      .required(<FormattedLabel id="rationCardNoValidation" />)
      .matches(
        /^[A-Za-z0-9]{12}$/,
        language == "en"
          ? "please enter valid ration card number !!!"
          : "कृपया वैध शिधापत्रिका क्रमांक प्रविष्ट करा !!!"
      )
      .min(
        12,
        language == "en"
          ? "please enter valid ration card number !!!"
          : "कृपया वैध शिधापत्रिका क्रमांक प्रविष्ट करा !!!"
      )
      .max(
        12,
        language == "en"
          ? "please enter valid ration card number !!!"
          : "कृपया वैध शिधापत्रिका क्रमांक प्रविष्ट करा !!!"
      )
      .typeError(),
    //  // applicantType
    applicantType: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="applicantTypeValidation" />),
    // // disblityNameYesNo
    // disablityNameYN: yup
    //   .boolean()
    //   .required(<FormattedLabel id='applicantTypeValidation' />),
    // typeofdisability
    // typeOfDisability: yup.string().when("disablityNameYN", {
    //   is: true,
    //   then: yup
    //     .string()
    //     // .nullable()
    //     .required(<FormattedLabel id='typeOfDisabilityValidation' />),
    // })

    //! 2
    //  // cr  city survey number
    crCitySurveyNumber: yup
      .string()
      .required(<FormattedLabel id="citySurveyNoValdationA" />)
      .matches(
        /^[0-9]+$/,
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      )
      .typeError(),
    // // pr city survey number
    prCitySurveyNumber: yup
      .string()
      .required(<FormattedLabel id="citySurveyNoValdationA" />)
      .matches(
        /^[0-9]+$/,
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      )
      .typeError(),
    //// crZoneKey
    crZoneKey: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="zoneNameValidation" />),
    ////prZoneKey
    prZoneKeyT: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="zoneNameValidation" />),
    //// crWardName
    crWardName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="wardNameValidation" />),
    ////  prWardName
    prWardNameT: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="wardNameValidation" />),
    // // crAreaName
    crAreaName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="areaNameValidation" />),
    //  // prAreaName
    prAreaNameT: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="areaNameValidation" />),
    // // crLandmarkName
    crLandmarkName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="landmarkNameValidation" />),
    //   // prLandmarkName
    prLandmarkNameT: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="landmarkNameValidation" />),
    // // crVillageName
    crVillageName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="roadNameValidation" />),
    // // prVillageName
    prVillageNameT: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="roadNameValidation" />),
    //  // crCityName
    crCityName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="cityNameValidation" />),
    //  // prCityName
    prCityName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="cityNameValidation" />),
    //  // crState
    crState: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="stateNameValidation" />),
    //  // prState
    prState: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="stateNameValidation" />),
    //  // crPinCode
    crPincode: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="pinCodeValidation" />),
    //  // prPincode
    prPincodeT: yup
      .string()
      .required(<FormattedLabel id="pinCodeValidation" />)
      .matches(
        /^[0-9]+$/,
        language === "en"
          ? "Invalid PIN code. Only numbers are allowed."
          : "अवैध पिन कोड. फक्त संख्यांना परवानगी आहे."
      )
      .min(
        6,
        language == "en"
          ? "Invalid PIN code. Please enter a 6-digit number."
          : "अवैध पिन कोड. कृपया 6-अंकी क्रमांक प्रविष्ट करा."
      )
      .max(
        6,
        language == "en"
          ? "Invalid PIN code. Please enter a 6-digit number."
          : "अवैध पिन कोड. कृपया 6-अंकी क्रमांक प्रविष्ट करा."
      )
      .typeError(
        language === "en"
          ? "Invalid PIN code. Only numbers are allowed."
          : "अवैध पिन कोड. फक्त संख्यांना परवानगी आहे."
      ),

    //  // crLattitude
    crLattitude: yup
      .string()
      .nullable()
      .test(
        "is-valid",
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे",
        (value) => {
          if (!value) return true;
          return /^\d+(\.\d+)?$/.test(value);
        }
      )
      .typeError(
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      ),
    //  // prLattitude
    prLattitude: yup
      .string()
      .nullable()
      .test(
        "is-valid",
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे",
        (value) => {
          if (!value) return true;
          return /^\d+(\.\d+)?$/.test(value);
        }
      )
      .typeError(
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      ),

    //  // crLogitude
    crLogitude: yup
      .string()
      .nullable()
      .test(
        "is-valid",
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे",
        (value) => {
          if (!value) return true;
          return /^\d+(\.\d+)?$/.test(value);
        }
      )
      .typeError(
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      ),

    // // prLogitude
    prLogitude: yup
      .string()
      .nullable()
      .test(
        "is-valid",
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे",
        (value) => {
          if (!value) return true;
          return /^\d+(\.\d+)?$/.test(value);
        }
      )
      .typeError(
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      ),
    //!3
    aadhaarNo: yup
      .string()
      .required(<FormattedLabel id="aadharNumberValidation" />)
      .matches(
        /^[2-9]\d{11}$/,
        language == "en" ? "Invalid Aadhaar number" : "अवैध आधार क्रमांक"
      )
      .matches(
        /^\d+$/,
        language == "en"
          ? "Invalid Aadhaar number. It should contain only numbers."
          : "अवैध आधार क्रमांक. त्यात फक्त संख्या असावी."
      )
      .typeError(
        language == "en" ? "Invalid Aadhaar number" : "अवैध आधार क्रमांक"
      )
      .min(
        12,
        language == "en"
          ? "please enter valid aadhaar number"
          : "कृपया वैध आधार क्रमांक टाका"
      )
      .max(
        12,
        language == "en"
          ? "please enter valid aadhaar number"
          : "कृपया वैध आधार क्रमांक टाका"
      )
      .typeError(
        language == "en"
          ? "please enter valid aadhaar number"
          : "कृपया वैध आधार क्रमांक टाका"
      ),

    //! 4
    // // city survey no
    citySurveyNo: yup
      .string()
      .required(<FormattedLabel id="citySurveyNoValdationA" />)
      .matches(
        /^[0-9]+$/,
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      )
      .typeError(
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      ),
    // // Zone Name -Validation
    zoneKey: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="zoneNameValidation" />),
    // // wardName,
    wardName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="wardNameValidation" />),
    // // Area Name
    areaName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="areaNameValidation" />),
    // // VillageName - road Name
    villageName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="roadNameValidation" />),
    // // LandmarkName
    landmarkName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="landmarkNameValidation" />),
    //  // cityName
    cityName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="cityNameValidation" />),
    //  // state
    state: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="stateNameValidation" />),
    //  // pincode
    pincode: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="pinCodeValidation" />),
    // // hawkingZoneName
    hawkingZoneName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="hawkingZoneNameValidation" />),
    // // hawkerType
    hawkerType: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="hawkerTypeValidation" />),
    // // natureOfBusiness
    natureOfBusiness: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="natureOfBusinessValidation" />),
    //  // hawkingDurationDaily
    hawkingDurationDaily: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="hawkingDurationDailyValidation" />),
    // // hawkerMode
    hawkerMode: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="streetvendorModeNameValidation" />),
    //  // item
    item: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="itemValidation" />),
    // // oldLicenseNo
    // oldLicenseNo: yup
    //   .string()
    //   .required(<FormattedLabel id='oldLicenseNoValidation' />),
    // // oldLicenseDate
    // oldLicenseDate: yup
    //   .date()
    //   .required(<FormattedLabel id="oldLicenseDateValidation" />)
    //   .typeError("old license date is required/जुनी परवाना तारीख आवश्यक आहे !!!"),
    // // education
    education: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="educationValidation" />),
    //  // areaOfStreetvendor
    // areaOfStreetvendor: yup
    //   .string()
    //   .required(<FormattedLabel id='areaOfStreetvendorValidation' />),
    // // voterNameYN
    voterNameYN: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="voterNameYNValidation" />),
    //  // voterId
    // voterId: yup.string().required(<FormattedLabel id="voterIdValidation" />),
    //  // bankMaster
    bankMaster: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="bankMasterValidation" />),
    //  // branchName
    branchName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="branchNameValidation" />),
    // // bankAccountNo
    bankAccountNo: yup
      .string()
      .required(<FormattedLabel id="bankAccountNoValidation" />)
      .matches(
        /^[0-9]+$/,
        language === "en"
          ? "Invalid bank account number. Only numbers are allowed."
          : "अवैध बँक खाते क्रमांक. फक्त संख्यांना परवानगी आहे."
      )
      .min(
        9,
        language == "en"
          ? "please enter valid bank account number"
          : "कृपया वैध बँक खाते क्रमांक प्रविष्ट करा"
      )
      .max(
        18,
        language == "en"
          ? "please enter valid bank account number"
          : "कृपया वैध बँक खाते क्रमांक प्रविष्ट करा"
      )
      .typeError(
        language === "en"
          ? "Invalid bank account number. Only numbers are allowed."
          : "अवैध बँक खाते क्रमांक. फक्त संख्यांना परवानगी आहे."
      ),
    // //ifscCode
    ifscCode: yup
      .string()
      .required(
        language === "en" ? "IFSC code is required" : "आयएसएसी कोड आवश्यक आहे"
      )
      .matches(
        /^[A-Z]{4}\d{7}$/,
        language === "en"
          ? "Invalid IFSC code. Please enter a valid IFSC code."
          : "अवैध आयएसएसी कोड. कृपया एक वैध आयएसएसी कोड प्रविष्ट करा."
      )
      .min(
        11,
        language === "en"
          ? "Invalid IFSC code. Please enter a valid 11-character IFSC code."
          : "अवैध आयएसएसी कोड. कृपया एक वैध 11-अक्षरी आयएसएसी कोड प्रविष्ट करा."
      )
      .max(
        11,
        language === "en"
          ? "Invalid IFSC code. Please enter a valid 11-character IFSC code."
          : "अवैध आयएसएसी कोड. कृपया एक वैध 11-अक्षरी आयएसएसी कोड प्रविष्ट करा."
      )
      .typeError(
        language === "en" ? "Invalid IFSC code." : "अवैध आयएसएसी कोड."
      ),
    // // hawkerLattitude
    hawkerLattitude: yup
      .string()
      .nullable()
      .test(
        "is-valid",
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे",
        (value) => {
          if (!value) return true;
          return /^\d+(\.\d+)?$/.test(value);
        }
      )
      .typeError(
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      ),
    // // hawkerDetailsLogitude

    hawkerDetailsLogitude: yup
      .string()
      .nullable()
      .test(
        "is-valid",
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे",
        (value) => {
          if (!value) return true;
          return /^\d+(\.\d+)?$/.test(value);
        }
      )
      .typeError(
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      ),

    //  // period of residense in maharashtra
    periodOfResidenceInMaharashtraMonth: yup
      .string()
      .required(
        language === "en"
          ? "period of residence in maharashtra in months is required !!!"
          : "महाराष्ट्रात राहण्याचा कालावधी महिन्यांत आवश्यक!!!"
      )
      .matches(
        /^[1-9]\d*$/,
        language === "en"
          ? "Only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      )
      .min(
        1,
        language === "en"
          ? "Please enter valid months"
          : "कृपया वैध महिने प्रविष्ट करा"
      )
      .max(
        3,
        language === "en"
          ? "Please enter valid months"
          : "कृपया वैध महिने प्रविष्ट करा"
      ),
    // // period of residense in pune
    periodOfResidenceInPCMCMonth: yup
      .string()
      .required(
        language === "en"
          ? "period of residence in pcmc in months is required !!!"
          : "pcmc मध्ये राहण्याचा कालावधी महिन्यांत आवश्यक आहे !!!"
      )
      .matches(
        /^[1-9]\d*$/,
        language === "en"
          ? "Only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      )
      .min(
        1,
        language === "en"
          ? "Please enter valid months"
          : "कृपया वैध महिने प्रविष्ट करा"
      )
      .max(
        3,
        language === "en"
          ? "Please enter valid months"
          : "कृपया वैध महिने प्रविष्ट करा"
      )
      .test({
        name: "comparePeriods",
        test: function (value) {
          console.log(
            "value121212",
            value,
            this.parent.periodOfResidenceInMaharashtraMonth
          );
          const pcmcMonths = parseInt(value);
          const maharashtraMonths = parseInt(
            this.parent.periodOfResidenceInMaharashtraMonth
          );
          return pcmcMonths <= maharashtraMonths;
        },
        message:
          language === "en"
            ? "PCMC Month should not be greater than Maharashtra Month"
            : "PCMC मधील महिने हे महाराष्ट्र महिन्यांपेक्षा जास्त नसावे",
      }),

    //! 5

    //  //aadhaarCardPhoto
    aadharPhoto: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="aadhaarCardPhotoValidation" />),
    //  //panCardPhoto
    panCardPhoto: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="panCardPhotoValidation" />),
    // //rationCardPhoto
    rationCardPhoto: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="rationCardPhotoValidation" />),
    // //applicantPhoto
    applicantPhoto: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="hawkerPhotoValidation" />),
    // // chequeorPassbookPhoto
    chequeorPassbookPhoto: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="chequeorPassbookPhotoValidation" />),

    // // shopBusinessOldLicensePhoto
    shopBusinessOldLicensePhoto: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="shopBusinessOldLicensePhotoValidation" />),


    // // disablityCertificatepHoto
    disablityCertificatePhoto: yup.string().when(["disablityNameYN"], {
      is: (disablityNameYN) => {
        console.log("AGER", disablityNameYN, disablityNameYN === "true")
        return disablityNameYN === "true"
      },
      then: yup
        .string()
        .nullable()
        .required(<FormattedLabel id="disablityCertificatePhotoValidation" />),
      otherwise: yup.string().nullable(),
    }),







    //  //disablityCertificatePhoto
    // disablityCertificatePhoto: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="disablityCertificatePhotoValidation" />),
    // //affidaviteOnRS100StampAttache
    // affidaviteOnRS100StampAttache: yup
    //   .string()
    //   .nullable()
    //   .required(
    //     <FormattedLabel id='affidaviteOnRS100StampAttacheValidation' />,
    //   ),
    // otherDocumentPhoto
    // otherDocumentPhoto: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id='otherDocumentPhotoValidation' />),
  });
};
