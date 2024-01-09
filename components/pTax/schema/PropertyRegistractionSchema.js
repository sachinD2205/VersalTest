import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";


//! EmptySchema
export let EmptySchema = () => {
  return yup.object().shape({
  });
};


// PropertyRegistractionSchema
export let PropertyRegistractionSchema = (language) => {
  console.log("language21312", language)
  return yup.object().shape({
    //! start

    titleID: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="titleValidation" />),

    firstNameEng: yup
      .string().nullable()
      .matches(
        /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/,
        language == "en"
          ? "only english words are allowed"
          : "फक्त इंग्रजी शब्दांना परवानगी आहे"
      )
      .required(<FormattedLabel id="firstNameValidation" />),

    firstNameMr: yup
      .string().nullable()
      .required(<FormattedLabel id="firstNameValidationMr" />)
      .matches(
        /^[\u0900-\u097F]+(?:\s[\u0900-\u097F]+)*$/,
        language == "en"
          ? "only marathi words are allowed"
          : "फक्त मराठी शब्दांना परवानगी आहे"
      ),

    middleNameEng: yup
      .string().nullable()
      .matches(
        /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/,
        language == "en"
          ? "only english words are allowed"
          : "फक्त इंग्रजी शब्दांना परवानगी आहे"
      )
      .required(<FormattedLabel id="middleNameValidation" />),

    middleNameMr: yup
      .string().nullable()
      .required(<FormattedLabel id="middleNameValidationMr" />)
      .matches(
        /^[\u0900-\u097F]+(?:\s[\u0900-\u097F]+)*$/,
        language == "en"
          ? "only marathi words are allowed"
          : "फक्त मराठी शब्दांना परवानगी आहे"
      ),

    lastNameEng: yup
      .string().nullable()
      .matches(
        /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/,
        language == "en"
          ? "only english words are allowed"
          : "फक्त इंग्रजी शब्दांना परवानगी आहे"
      )
      .required(<FormattedLabel id="lastNameValidation" />),

    lastNameMr: yup
      .string().nullable()
      .required(<FormattedLabel id="lastNameValidationMr" />)
      .matches(
        /^[\u0900-\u097F]+(?:\s[\u0900-\u097F]+)*$/,
        language == "en"
          ? "only marathi words are allowed"
          : "फक्त मराठी शब्दांना परवानगी आहे"
      ),

    genderID: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="genderValidation" />),

    mobile: yup
      .string().nullable()
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


    aadharNo: yup
      .string().nullable()
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


    //   // emailaddress
    emailID: yup
      .string().nullable()
      .required(<FormattedLabel id="emailIdValidation" />)
      .email(
        language == "en"
          ? "please enter valid email address"
          : "कृपया वैध ई-मेल पत्ता प्रविष्ट करा"
      )
      .typeError(),

    //! end
  });
};



// AddressOfPropertyHolderSchema1
export let AddressOfPropertyHolderSchema1 = (language) => {
  console.log("sdfds", language)
  return yup.object().shape({

    trnProprtyHolderAddressDao: yup.object().shape({

      //! citySurveyNumber
      citySurveyNumber: yup
        .string().nullable()
        .required(<FormattedLabel id="citySurveyNumberValidation" />)
        .matches(
          /^[0-9]+$/,
          language == "en"
            ? "only numbers are allowed"
            : "फक्त संख्यांना परवानगी आहे"
        )
        .typeError(),

      //! revenueSurveyNumber
      revenueSurveyNumber: yup
        .string().nullable()
        .required(<FormattedLabel id="revenueSurveyNumberValidation" />)
        .matches(
          /^[0-9]+$/,
          language == "en"
            ? "only numbers are allowed"
            : "फक्त संख्यांना परवानगी आहे"
        )
        .typeError(),

      //! circleId
      circleId: yup
        .string()
        .nullable()
        .required(<FormattedLabel id="circleNameValidation" />),


      //! gatId
      gatId: yup
        .string()
        .nullable()
        .required(<FormattedLabel id="gatNameValidation" />),

      // //! zoneId
      // zoneId: yup
      //   .string()
      //   .nullable()
      //   .required(<FormattedLabel id="zoneNameValidation" />),

      // //! wardId
      // wardId: yup
      //   .string()
      //   .nullable()
      //   .required(<FormattedLabel id="wardNameValidation" />),

      //! areaId
      areaId: yup
        .string()
        .nullable()
        .required(<FormattedLabel id="areaNameValidation" />),

      //! villageId
      villageId: yup
        .string()
        .nullable()
        .required(<FormattedLabel id="villageNameValidation" />),

      //!  landmarkId
      landmarkId: yup
        .string()
        .nullable()
        .required(<FormattedLabel id="landmarkNameValidation" />),

      //!  pinCodeId
      pinCodeId: yup
        .string()
        .nullable()
        .required(<FormattedLabel id="pinCodeValidation" />),

      //! sectorBlockNumber
      sectorBlockNumber: yup
        .string().nullable()
        .required(<FormattedLabel id="sectorBlockNumberValidation" />)
        .matches(
          /^[0-9]+$/,
          language == "en"
            ? "only numbers are allowed"
            : "फक्त संख्यांना परवानगी आहे"
        )
        .typeError(),

      //! flatNumber
      flatNumber: yup
        .string().nullable()
        .required(<FormattedLabel id="flatNumberValidation" />)
        .matches(
          /^[0-9]+$/,
          language == "en"
            ? "only numbers are allowed"
            : "फक्त संख्यांना परवानगी आहे"
        )
        .typeError(),

      //! buildingName
      buildingName: yup
        .string().nullable()
        .required(<FormattedLabel id="buildingNameValidation" />)
        .matches(
          /^(?![ ])[A-Za-z0-9\u0900-\u097F ]*$/,
          language == "en"
            ? "Please enter a valid input."
            : "कृपया एक वैध इनपुट प्रविष्ट करा."
        ),

      //! societyName
      societyName: yup
        .string().nullable()
        .required(<FormattedLabel id="societyNameValidation" />)
        .matches(
          /^(?![ ])[A-Za-z0-9\u0900-\u097F ]*$/,
          language == "en"
            ? "Please enter a valid input."
            : "कृपया एक वैध इनपुट प्रविष्ट करा."
        ),

      //! cityName
      cityName: yup
        .string()
        .nullable()
        .required(<FormattedLabel id="cityNameValidation" />),

      //! state
      state: yup
        .string().nullable()
        .required(<FormattedLabel id="stateValidation" />)
        .matches(
          /^(?![ ])[A-Za-z0-9\u0900-\u097F ]*$/,
          language == "en"
            ? "Please enter a valid input."
            : "कृपया एक वैध इनपुट प्रविष्ट करा."
        ),

      //! lattitude
      lattitude: yup
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

      //! logitude
      logitude: yup
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

      //! postalFullAddressEng
      postalFullAddressEng: yup
        .string().nullable()
        .required(<FormattedLabel id="postalFullAddressEngValidation" />)
        .matches(
          /^(?![ ])[A-Za-z0-9, ]*$/,
          language == "en"
            ? "only english words are allowed"
            : "फक्त इंग्रजी शब्दांना परवानगी आहे"
        ),

      //! postalFullAddressMr
      postalFullAddressMr: yup
        .string().nullable()
        .required(<FormattedLabel id="postalFullAddressMrValidation" />)
        .matches(
          /^(?![ ])[A-Za-z0-9, ]*$/,
          language == "en"
            ? "only marathi words are allowed"
            : "फक्त मराठी शब्दांना परवानगी आहे"
        ),

    })

  });
};

// AddressOfPropertyHolderSchema2
export let AddressOfPropertyHolderSchema2 = (language) => {
  console.log("sdfds", language)
  return yup.object().shape({


    trnProprtyHolderAddressDao: yup.object().shape({

      //! citySurveyNumber
      citySurveyNumber: yup
        .string().nullable()
        .required(<FormattedLabel id="citySurveyNumberValidation" />)
        .matches(
          /^[0-9]+$/,
          language == "en"
            ? "only numbers are allowed"
            : "फक्त संख्यांना परवानगी आहे"
        )
        .typeError(),

      //! revenueSurveyNumber
      revenueSurveyNumber: yup
        .string().nullable()
        .required(<FormattedLabel id="revenueSurveyNumberValidation" />)
        .matches(
          /^[0-9]+$/,
          language == "en"
            ? "only numbers are allowed"
            : "फक्त संख्यांना परवानगी आहे"
        )
        .typeError(),

      //! circleId
      circleId: yup
        .string()
        .nullable()
        .required(<FormattedLabel id="gatNameValidation" />),

      //! gatId
      gatId: yup
        .string()
        .nullable()
        .required(<FormattedLabel id="gatNameValidation" />),

      // //! zoneId
      // zoneId: yup
      //   .string()
      //   .nullable()
      //   .required(<FormattedLabel id="zoneNameValidation" />),

      // //! wardId
      // wardId: yup
      //   .string()
      //   .nullable()
      //   .required(<FormattedLabel id="wardNameValidation" />),

      //! areaId
      areaId: yup
        .string()
        .nullable()
        .required(<FormattedLabel id="areaNameValidation" />),

      //! villageId
      villageId: yup
        .string()
        .nullable()
        .required(<FormattedLabel id="villageNameValidation" />),

      //!  landmarkId
      landmarkId: yup
        .string()
        .nullable()
        .required(<FormattedLabel id="landmarkNameValidation" />),

      //!  pinCodeId
      pinCodeId: yup
        .string()
        .nullable()
        .required(<FormattedLabel id="pinCodeValidation" />),

      //! sectorBlockNumber
      sectorBlockNumber: yup
        .string().nullable()
        .required(<FormattedLabel id="sectorBlockNumberValidation" />)
        .matches(
          /^[0-9]+$/,
          language == "en"
            ? "only numbers are allowed"
            : "फक्त संख्यांना परवानगी आहे"
        )
        .typeError(),

      //! flatNumber
      flatNumber: yup
        .string().nullable()
        .required(<FormattedLabel id="flatNumberValidation" />)
        .matches(
          /^[0-9]+$/,
          language == "en"
            ? "only numbers are allowed"
            : "फक्त संख्यांना परवानगी आहे"
        )
        .typeError(),

      //! buildingName
      buildingName: yup
        .string().nullable()
        .required(<FormattedLabel id="buildingNameValidation" />)
        .matches(
          /^(?![ ])[A-Za-z0-9\u0900-\u097F ]*$/,
          language == "en"
            ? "Please enter a valid input."
            : "कृपया एक वैध इनपुट प्रविष्ट करा."
        ),

      //! societyName
      societyName: yup
        .string().nullable()
        .required(<FormattedLabel id="societyNameValidation" />)
        .matches(
          /^(?![ ])[A-Za-z0-9\u0900-\u097F ]*$/,
          language == "en"
            ? "Please enter a valid input."
            : "कृपया एक वैध इनपुट प्रविष्ट करा."
        ),

      //! cityName
      cityName: yup
        .string()
        .nullable()
        .required(<FormattedLabel id="cityNameValidation" />),

      //! stateBilling
      state: yup
        .string().nullable()
        .required(<FormattedLabel id="stateValidation" />)
        .matches(
          /^(?![ ])[A-Za-z0-9\u0900-\u097F ]*$/,
          language == "en"
            ? "Please enter a valid input."
            : "कृपया एक वैध इनपुट प्रविष्ट करा."
        ),

      //! lattitude
      lattitude: yup
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

      //! logitude
      logitude: yup
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




      //! ================================================================> 




      //! citySurveyNumberBilling
      citySurveyNumberBilling: yup
        .string().nullable()
        .required(<FormattedLabel id="citySurveyNumberValidation" />)
        .matches(
          /^[0-9]+$/,
          language == "en"
            ? "only numbers are allowed"
            : "फक्त संख्यांना परवानगी आहे"
        )
        .typeError(),

      //! revenueSurveyNumberBilling
      revenueSurveyNumberBilling: yup
        .string().nullable()
        .required(<FormattedLabel id="revenueSurveyNumberValidation" />)
        .matches(
          /^[0-9]+$/,
          language == "en"
            ? "only numbers are allowed"
            : "फक्त संख्यांना परवानगी आहे"
        )
        .typeError(),

      //! circleIdBilling
      circleIdBilling: yup
        .string()
        .nullable()
        .required(<FormattedLabel id="circleNameValidation" />),

      // //! zoneIdBilling
      // zoneIdBilling: yup
      //   .string()
      //   .nullable()
      //   .required(<FormattedLabel id="zoneNameValidation" />),

      // //! wardIdBilling
      // wardIdBilling: yup
      //   .string()
      //   .nullable()
      //   .required(<FormattedLabel id="wardNameValidation" />),

      // //! areaIdBilling
      // areaIdBilling: yup
      //   .string()
      //   .nullable()
      //   .required(<FormattedLabel id="areaNameValidation" />),

      //! villageIdBilling
      villageIdBilling: yup
        .string()
        .nullable()
        .required(<FormattedLabel id="villageNameValidation" />),

      //!  landmarkIdBilling
      landmarkIdBilling: yup
        .string()
        .nullable()
        .required(<FormattedLabel id="landmarkNameValidation" />),

      //!  pinCodeIdBilling
      pinCodeIdBilling: yup
        .string()
        .nullable()
        .required(<FormattedLabel id="pinCodeValidation" />),

      //! sectorBlockNumberBilling
      sectorBlockNumberBilling: yup
        .string().nullable()
        .required(<FormattedLabel id="sectorBlockNumberValidation" />)
        .matches(
          /^[0-9]+$/,
          language == "en"
            ? "only numbers are allowed"
            : "फक्त संख्यांना परवानगी आहे"
        )
        .typeError(),

      //! flatNumberBilling
      flatNumberBilling: yup
        .string().nullable()
        .required(<FormattedLabel id="flatNumberValidation" />)
        .matches(
          /^[0-9]+$/,
          language == "en"
            ? "only numbers are allowed"
            : "फक्त संख्यांना परवानगी आहे"
        )
        .typeError(),

      //! buildingNameBilling
      buildingNameBilling: yup
        .string().nullable()
        .required(<FormattedLabel id="buildingNameValidation" />)
        .matches(
          /^(?![ ])[A-Za-z0-9\u0900-\u097F ]*$/,
          language == "en"
            ? "Please enter a valid input."
            : "कृपया एक वैध इनपुट प्रविष्ट करा."
        ),

      //! societyNameBilling
      societyNameBilling: yup
        .string().nullable()
        .required(<FormattedLabel id="societyNameValidation" />)
        .matches(
          /^(?![ ])[A-Za-z0-9\u0900-\u097F ]*$/,
          language == "en"
            ? "Please enter a valid input."
            : "कृपया एक वैध इनपुट प्रविष्ट करा."
        ),

      //! cityNameBilling
      cityNameBilling: yup
        .string()
        .nullable()
        .required(<FormattedLabel id="cityNameValidation" />),

      //! stateBillingBilling
      stateBilling: yup
        .string().nullable()
        .required(<FormattedLabel id="stateValidation" />)
        .matches(
          /^(?![ ])[A-Za-z0-9\u0900-\u097F ]*$/,
          language == "en"
            ? "Please enter a valid input."
            : "कृपया एक वैध इनपुट प्रविष्ट करा."
        ),

      //! lattitudeBilling
      lattitudeBilling: yup
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

      //! logitudeBilling
      logitudeBilling: yup
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
    })

  });
};




// PropertyInformationSchema
export let PropertyInformationSchema = (language) => {
  console.log("language21312", language)
  return yup.object().shape({
    //! start 

    //! buildingPermission
    // buildingPermission: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="buildingPermissionValidation" />),

    //! usageType
    usageType: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="usageTypeValidation" />),

    //!  constructionType
    constructionType: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="constructionTypeValidation" />),

    //!  area
    area: yup
      .string().nullable()
      .required(<FormattedLabel id="areaValidation" />)
      .matches(
        /^[0-9]+$/,
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      )
      .typeError(),

    //!  parking
    // parking: yup
    //   .string().nullable()
    //   .required(<FormattedLabel id="parkingValidation" />)
    //   .matches(
    //     /^[0-9]+$/,
    //     language == "en"
    //       ? "only numbers are allowed"
    //       : "फक्त संख्यांना परवानगी आहे"
    //   )
    //   .typeError(),

    //!  parkingArea
    parkingArea: yup.string().nullable().when('parking', {
      is: (val) => val == true || val == "1",
      then: yup
        .string().nullable()
        .required(<FormattedLabel id="parkingAreaValidation" />)
        .matches(
          /^[0-9]+$/,
          language === 'en'
            ? 'only numbers are allowed'
            : 'फक्त संख्यांना परवानगी आहे'
        )
        .typeError(),
      otherwise: yup.string(),
    }),

    //!  totalArea
    totalArea: yup
      .string().nullable()
      .required(<FormattedLabel id="totalAreaValidation" />)
      .matches(
        /^[0-9]+$/,
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      )
      .typeError(),

    //!  unit
    unit: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="unitValidation" />),

    //! assessmentDate
    assessmentDate: yup
      .date().nullable()
      .required(<FormattedLabel id="assessmentDateValidation" />)
      .typeError(
        language == "en"
          ? "assessment date selection is required !!!"
          : "मूल्यांकन तारीख निवड आवश्यक आहे !!!"
      ),

    //! end
  });
};




export let additionalInfoSchemaforWaterElectricAndBankDetails = (
  language
) => {
  console.log("language21312", language)
  return yup.object().shape({

    //! water ===========================>

    //! waterConnectionTypeNameId
    waterConnectionTypeNameId: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="waterConnectionTypeNameIdValidation" />)
      .matches(
        /^[0-9]+$/,
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      )
      .typeError(),

    //! numberOfWaterConnection
    numberOfWaterConnection: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="numberOfWaterConnectionValidation" />)
      .matches(
        /^[0-9]+$/,
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      )
      .typeError(),

    //! diameter
    diameter: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="diameterValidation" />)
      .matches(
        /^[0-9]+$/,
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      )
      .typeError(),


    //! electric ==============================>

    //! electricalConnectionTypeID
    electricalConnectionTypeID: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="electricalConnectionTypeIdValidation" />)
      .matches(
        /^[0-9]+$/,
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      )
      .typeError(),

    //! dateOfElectricalConnection
    dateOfElectricalConnection: yup
      .date()
      .nullable()
      .required(<FormattedLabel id="dateOfElectricalConnectionValidation" />)
      .typeError(
        language == "en"
          ? "electric connection  date selection is required !!!"
          : "वीज कनेक्शन तारीख निवड आवश्यक आहे !!!"
      ),

    //! electricalConsumerNo
    electricalConsumerNo: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="electricConsumerNumberValidation" />)
      .matches(
        /^[0-9]+$/,
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      )
      .typeError(),

    //! bankDetails ====================================> 
    bankDetails: yup.object().shape({

      //! bankNameId
      bankNameId: yup
        .string()
        .nullable()
        .required(<FormattedLabel id="bankNameIdValidation" />),



      //! branchName
      branchName: yup.string()
        .nullable()
        .required(<FormattedLabel id="branchNameValidation" />)
        .matches(
          /^(?![ ])[A-Za-z0-9\u0900-\u097F ]*$/,
          language == "en"
            ? "only marathi words are allowed"
            : "फक्त मराठी शब्दांना परवानगी आहे"
        ),

      //! bankAccountNumber
      bankAccountNumber: yup
        .string()
        .nullable()
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

      //!ifscCode
      ifscCode: yup
        .string()
        .nullable()
        .required(
          language === "en" ? "IFSC code is required" : "आयफएससी कोड आवश्यक आहे"
        )
        .matches(
          /^[A-Z]{4}\d{7}$/,
          language === "en"
            ? "Invalid IFSC code. Please enter a valid IFSC code."
            : "अवैध आयफएससी कोड. कृपया एक वैध आयफएससी कोड प्रविष्ट करा."
        )
        .min(
          11,
          language === "en"
            ? "Invalid IFSC code. Please enter a valid 11-character IFSC code."
            : "अवैध आयफएससी कोड. कृपया एक वैध 11-अक्षरी आयफएससी कोड प्रविष्ट करा."
        )
        .max(
          11,
          language === "en"
            ? "Invalid IFSC code. Please enter a valid 11-character IFSC code."
            : "अवैध आयफएससी कोड. कृपया एक वैध 11-अक्षरी आयफएससी कोड प्रविष्ट करा."
        )
        .typeError(
          language === "en" ? "Invalid IFSC code." : "अवैध आयफएससी कोड."
        ),

    })

  });
};


export let additionalInfoSchemaforWaterAndBankDetails = (
  language
) => {
  console.log("language21312", language)
  return yup.object().shape({

    //! waterConnectionTypeNameId
    waterConnectionTypeNameId: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="waterConnectionTypeNameIdValidation" />)
      .matches(
        /^[0-9]+$/,
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      )
      .typeError(),

    //! numberOfWaterConnection
    numberOfWaterConnection: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="numberOfWaterConnectionValidation" />)
      .matches(
        /^[0-9]+$/,
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      )
      .typeError(),

    //! diameter
    diameter: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="diameterValidation" />)
      .matches(
        /^[0-9]+$/,
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      )
      .typeError(),

    //! bankDetails ====================================> 
    bankDetails: yup.object().shape({

      //! bankNameId
      bankNameId: yup
        .string()
        .nullable()
        .required(<FormattedLabel id="bankNameIdValidation" />),



      //! branchName
      branchName: yup.string().nullable()
        .required(<FormattedLabel id="branchNameValidation" />)
        .matches(
          /^(?![ ])[A-Za-z0-9\u0900-\u097F ]*$/,
          language == "en"
            ? "only marathi words are allowed"
            : "फक्त मराठी शब्दांना परवानगी आहे"
        ),

      //! bankAccountNumber
      bankAccountNumber: yup
        .string().nullable()
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

      //!ifscCode
      ifscCode: yup
        .string().nullable()
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

    })

  });
};

export let additionalInfoSchemaforElectricAndBankDetails = (
  language
) => {
  console.log("language21312", language)
  return yup.object().shape({

    //! electricalConnectionTypeID
    electricalConnectionTypeID: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="electricalConnectionTypeIdValidation" />)
      .matches(
        /^[0-9]+$/,
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      )
      .typeError(),

    //! dateOfElectricalConnection
    dateOfElectricalConnection: yup
      .date().nullable()
      .required(<FormattedLabel id="dateOfElectricalConnectionValidation" />)
      .typeError(
        language == "en"
          ? "electric connection  date selection is required !!!"
          : "वीज कनेक्शन तारीख निवड आवश्यक आहे !!!"
      ),

    //! electricalConsumerNo
    electricalConsumerNo: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="electricConsumerNumberValidation" />)
      .matches(
        /^[0-9]+$/,
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      )
      .typeError(),


    //! bankDetails ====================================> 
    bankDetails: yup.object().shape({

      //! bankNameId
      bankNameId: yup
        .string()
        .nullable()
        .required(<FormattedLabel id="bankNameIdValidation" />),



      //! branchName
      branchName: yup.string().nullable()
        .required(<FormattedLabel id="branchNameValidation" />)
        .matches(
          /^(?![ ])[A-Za-z0-9\u0900-\u097F ]*$/,
          language == "en"
            ? "only marathi words are allowed"
            : "फक्त मराठी शब्दांना परवानगी आहे"
        ),

      //! bankAccountNumber
      bankAccountNumber: yup
        .string().nullable()
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

      //!ifscCode
      ifscCode: yup
        .string().nullable()
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

    })

  });
};


export let additionalInfoSchemaforBankDetails = (
  language
) => {
  console.log("language21312", language)
  return yup.object().shape({

    //! bankDetails
    bankDetails: yup.object().shape({

      //! bankNameId
      bankNameId: yup
        .string()
        .nullable()
        .required(<FormattedLabel id="bankNameIdValidation" />),



      //! branchName
      branchName: yup.string().nullable()
        .required(<FormattedLabel id="branchNameValidation" />)
        .matches(
          /^(?![ ])[A-Za-z0-9\u0900-\u097F ]*$/,
          language == "en"
            ? "only marathi words are allowed"
            : "फक्त मराठी शब्दांना परवानगी आहे"
        ),

      //! bankAccountNumber
      bankAccountNumber: yup
        .string().nullable()
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

      //!ifscCode
      ifscCode: yup
        .string().nullable()
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

    })

  });
};

// doucmentUpload
export let propertyRegistractionDocumentsUploadSchema = (language, disablityNameYN) => {
  return yup.object().shape({

    //  //disablityCertificatePhoto
    // disablityCertificatePhoto: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="disablityCertificatePhotoValidation" />),


    // disablityCertificatePhoto: yup.string().when(["disablityNameYN"], {
    //   is: (disablityNameYN) => {
    //     console.log("AGER", disablityNameYN, disablityNameYN === "true")
    //     return disablityNameYN === "true"
    //   },
    //   then: yup
    //     .string()
    //     .nullable()
    //     .required(<FormattedLabel id="disablityCertificatePhotoValidation" />),
    //   otherwise: yup.string().nullable(),
    // }),


  });
};
