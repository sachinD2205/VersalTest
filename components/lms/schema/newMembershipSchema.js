import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

export let newMembershipSchema = (language, libType) => {
  console.log("newMembershipSchema", language, libType);
  let schema = {
    zoneKey: yup.string().required(<FormattedLabel id="selectZone" />),
    libraryType: yup.string().required(<FormattedLabel id="selectLibrary" />),
    libraryKey: yup.string().required(<FormattedLabel id="selectLibrary" />),
    atitle: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="selectTitle" />),
    atitlemr: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="selectTitle" />),
    afName: yup
      .string()
      .matches(
        /^[aA-zZ\s]+$/,
        language == "en"
          ? "Must be only english characters "
          : " फक्त इंग्लिश शब्द "
      )
      .required(<FormattedLabel id="enterFName" />),
    amName: yup
      .string()
      .matches(
        /^[aA-zZ\s]+$/,
        language == "en"
          ? "Must be only english characters "
          : " फक्त इंग्लिश शब्द "
      )
      .required(<FormattedLabel id="enterMName" />),
    alName: yup
      .string()
      .matches(
        /^[aA-zZ\s]+$/,
        language == "en"
          ? "Must be only english characters "
          : " फक्त इंग्लिश शब्द "
      )
      .required(<FormattedLabel id="enterLName" />),
    afNameMr: yup
      .string()
      .matches(
        /^[\u0900-\u097F]+/,
        language == "en" ? "Must be only marathi characters" : "फक्त मराठी शब्द"
      )
      .required(<FormattedLabel id="enterFNameMr" />),
    amNameMr: yup
      .string()
      .matches(
        /^[\u0900-\u097F]+/,
        language == "en" ? "Must be only marathi characters" : "फक्त मराठी शब्द"
      )
      .required(<FormattedLabel id="enterMNameMr" />),
    alNameMr: yup
      .string()
      .matches(
        /^[\u0900-\u097F]+/,
        language == "en" ? "Must be only marathi characters" : "फक्त मराठी शब्द"
      )
      .required(<FormattedLabel id="enterLNameMr" />),
    aemail: yup
      .string()
      .email(language == "en" ? "Incorrect format" : "चुकीचे स्वरूप")
      .required(<FormattedLabel id="enterEmailAddress" />),
    // amobileNo: yup
    //   .string()
    //   .matches(
    //     /^[0-9]+$/,
    //     language == "en" ? "Must be only digits" : "फक्त अंक असणे आवश्यक आहे"
    //   )
    //   .typeError(<FormattedLabel id="enterMobileNo" />)
    //   .min(
    //     10,
    //     language == "en"
    //       ? "Mobile Number must be at least 10 number"
    //       : "मोबाईल क्रमांक 10 क्रमांकाचा असावा"
    //   )
    //   .max(
    //     10,
    //     language == "en"
    //       ? "Mobile Number not valid on above 10 number"
    //       : "10 अंकी क्रमांकावरील मोबाईल क्रमांक वैध नाही"
    //   )
    //   .required(),
    amobileNo: yup
      // .string()
      // .matches(/^[6-9]\d{9}$/, "Invalid mobile number")
      // .required(
      //   language == "en" ? "Please enter a mobile no. " : "कृपया मोबाईल नं. भरा"
      // ),
      .string()
      .nullable()
      .required(
        language == "en"
          ? "Contact Number is Required !!!"
          : "संपर्क क्रमांक आवश्यक आहे !!!"
      )
      .matches(
        /^[0-9]+$/,
        language == "en"
          ? "Must be only digits !!!"
          : "फक्त अंक असणे आवश्यक आहे !!!"
      )
      .min(
        10,
        language == "en"
          ? "Mobile Number must be 10 number"
          : "मोबाईल क्रमांक 10 क्रमांकाचा असावा !!!"
      )
      .max(
        10,
        language == "en"
          ? "Mobile Number must be 10 number"
          : "मोबाईल नंबर 10 वरील नंबरवर वैध नाही !!!"
      ),
    aflatBuildingNo: yup
      .string()
      .matches(
        /^[A-Za-z0-9@-\s]+$/,
        language == "en" ? "Must be only in english " : " फक्त इंग्लिश मध्ये "
      )
      .required(<FormattedLabel id="enterFlat" />),
    abuildingName: yup
      .string()
      .matches(
        /^[A-Za-z0-9@-\s]+$/,
        language == "en" ? "Must be only in english " : " फक्त इंग्लिश मध्ये "
      )
      .required(<FormattedLabel id="enterApartment" />),
    aroadName: yup
      .string()
      .matches(
        /^[A-Za-z0-9@-\s]+$/,
        language == "en" ? "Must be only in english " : " फक्त इंग्लिश मध्ये "
      )
      .required(<FormattedLabel id="enterRoadName" />),
    alandmark: yup
      .string()
      .matches(
        /^[A-Za-z0-9@-\s]+$/,
        language == "en" ? "Must be only in english " : " फक्त इंग्लिश मध्ये "
      )
      .required(<FormattedLabel id="enterLandmark" />),
    aflatBuildingNoMr: yup
      .string()
      .matches(
        /^[\u0900-\u097F]+/,
        language == "en" ? "Must be only in marathi" : " फक्त मराठी मध्ये"
      )
      .required(<FormattedLabel id="enterFlatMr" />),
    abuildingNameMr: yup
      .string()
      .matches(
        /^[\u0900-\u097F]+/,
        language == "en" ? "Must be only in marathi" : " फक्त मराठी मध्ये"
      )
      .required(<FormattedLabel id="enterApartmentMr" />),
    aroadNameMr: yup
      .string()
      .matches(
        /^[\u0900-\u097F]+/,
        language == "en" ? "Must be only in marathi" : " फक्त मराठी मध्ये"
      )
      .required(<FormattedLabel id="enterRoadNameMr" />),
    alandmarkMr: yup
      .string()
      .matches(
        /^[\u0900-\u097F]+/,
        language == "en" ? "Must be only in marathi" : " फक्त मराठी मध्ये"
      )
      .required(<FormattedLabel id="enterLandmarkMr" />),
    acityName: yup
      .string()
      .matches(
        /^[A-Za-z0-9@-\s]+$/,
        language == "en"
          ? "Must be only english characters "
          : " फक्त इंग्लिश शब्द "
      )
      .required(<FormattedLabel id="enterCity" />),
    astate: yup
      .string()
      .matches(
        /^[A-Za-z0-9@-\s]+$/,
        language == "en"
          ? "Must be only english characters "
          : " फक्त इंग्लिश शब्द "
      )
      .required(<FormattedLabel id="enterState" />),
    acityNameMr: yup
      .string()
      .matches(
        /^[\u0900-\u097F]+/,
        language == "en"
          ? "Must be only marathi characters"
          : " फक्त मराठी शब्द"
      )
      .required(<FormattedLabel id="enterCityMr" />),
    astateMr: yup
      .string()
      .matches(
        /^[\u0900-\u097F]+/,
        language == "en" ? "Must be only marathi characters" : "फक्त मराठी शब्द"
      )
      .required(<FormattedLabel id="stateMr" />),
    apincode: yup
      .string()
      .matches(
        /^[0-9]+$/,
        language == "en" ? "Must be only digits" : "फक्त अंक असणे आवश्यक आहे"
      )
      .typeError(<FormattedLabel id="enterPinCode" />)
      .min(
        6,
        language == "en"
          ? "Pincode Number must be at least 6 number"
          : "पिनकोड क्रमांक 12 क्रमांकाचा असणे आवश्यक आहे"
      )
      .max(
        6,
        language == "en"
          ? "Pincode Number must be at Most 6 number"
          : "पिनकोड क्रमांक 12 क्रमांकाचा असणे आवश्यक आहे"
      )
      .required(<FormattedLabel id="enterPinCode" />),

    aadharNo: yup
      .string()
      .required(<FormattedLabel id="enteraadhaarNo" />)
      .matches(
        /^[0-9]+$/,
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      )
      .min(
        12,
        language == "en"
          ? "Aadhar Number must be at least 12 number"
          : "आधार क्रमांक किमान 12 क्रमांकाचा असणे आवश्यक आहे"
      )
      .max(
        12,
        language == "en"
          ? "Aadhar Number not valid on above 12 number"
          : "आधार क्रमांक १२ वरील क्रमांकावर वैध नाही"
      )
      .typeError(),

    applicationDate: yup
      .date()
      .typeError(<FormattedLabel id="selectDate" />)
      .required(),
    // membershipMonths: yup
    //   .string()
    //   .required(<FormattedLabel id="selectMembershipMonths" />),
    // education: yup.string().required(<FormattedLabel id="educationEnter" />)
    // -----------------------------------------------------------

    aadharCardDoc: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="identityProofMessage" />),
    aadharCardDoc1: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="addressProofMessage" />),
    photoAttachment: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="passportProofMessage" />),
    // -----------------------------------------------------------
  };
  if (libType === "L") {
    schema = {
      ...schema,
      taxReceipt: yup
        .string()
        .nullable()
        .required(<FormattedLabel id="taxReceiptMessage" />),

      referenceMobileNo: yup
        .string()
        .nullable()
        .required(
          language == "en"
            ? "Witness Mo. No. is Required !!!"
            : "साक्षीदाराचा संपर्क क्रमांक आवश्यक आहे !!!"
        )
        .matches(
          /^[0-9]+$/,
          language == "en"
            ? "Must be only digits !!!"
            : "फक्त अंक असणे आवश्यक आहे !!!"
        )
        .min(
          10,
          language == "en"
            ? "Mobile Number must be 10 number"
            : "मोबाईल क्रमांक 10 क्रमांकाचा असावा !!!"
        )
        .max(
          10,
          language == "en"
            ? "Mobile Number must be 10 number"
            : "मोबाईल नंबर 10 वरील नंबरवर वैध नाही !!!"
        ),
    };
  } else if (libType === "C") {
    schema = {
      ...schema,
      membershipMonths: yup
        .string()
        .required(<FormattedLabel id="selectMembershipMonths" />),
    };
  }
  let finalSchema = yup.object().shape(schema);
  return finalSchema;
};

// import * as yup from "yup";
// import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// export let newMembershipSchema = (language) => {
//   return yup.object().shape({
//     zoneKey: yup.string().required(<FormattedLabel id="selectZone" />),
//     libraryType: yup.string().required(<FormattedLabel id="selectLibrary" />),
//     libraryKey: yup.string().required(<FormattedLabel id="selectLibrary" />),
//     atitle: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="selectTitle" />),
//     atitlemr: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="selectTitle" />),
//     afName: yup
//       .string()
//       .matches(
//         /^[aA-zZ\s]+$/,
//         language == "en"
//           ? "Must be only english characters "
//           : " फक्त इंग्लिश शब्द "
//       )
//       .required(<FormattedLabel id="enterFName" />),
//     amName: yup
//       .string()
//       .matches(
//         /^[aA-zZ\s]+$/,
//         language == "en"
//           ? "Must be only english characters "
//           : " फक्त इंग्लिश शब्द "
//       )
//       .required(<FormattedLabel id="enterMName" />),
//     alName: yup
//       .string()
//       .matches(
//         /^[aA-zZ\s]+$/,
//         language == "en"
//           ? "Must be only english characters "
//           : " फक्त इंग्लिश शब्द "
//       )
//       .required(<FormattedLabel id="enterLName" />),
//     afNameMr: yup
//       .string()
//       .matches(
//         /^[\u0900-\u097F]+/,
//         language == "en" ? "Must be only marathi characters" : "फक्त मराठी शब्द"
//       )
//       .required(<FormattedLabel id="enterFNameMr" />),
//     amNameMr: yup
//       .string()
//       .matches(
//         /^[\u0900-\u097F]+/,
//         language == "en" ? "Must be only marathi characters" : "फक्त मराठी शब्द"
//       )
//       .required(<FormattedLabel id="enterMNameMr" />),
//     alNameMr: yup
//       .string()
//       .matches(
//         /^[\u0900-\u097F]+/,
//         language == "en" ? "Must be only marathi characters" : "फक्त मराठी शब्द"
//       )
//       .required(<FormattedLabel id="enterLNameMr" />),
//     aemail: yup
//       .string()
//       .email(language == "en" ? "Incorrect format" : "चुकीचे स्वरूप")
//       .required(<FormattedLabel id="enterEmailAddress" />),
//     // amobileNo: yup
//     //   .string()
//     //   .matches(
//     //     /^[0-9]+$/,
//     //     language == "en" ? "Must be only digits" : "फक्त अंक असणे आवश्यक आहे"
//     //   )
//     //   .typeError(<FormattedLabel id="enterMobileNo" />)
//     //   .min(
//     //     10,
//     //     language == "en"
//     //       ? "Mobile Number must be at least 10 number"
//     //       : "मोबाईल क्रमांक 10 क्रमांकाचा असावा"
//     //   )
//     //   .max(
//     //     10,
//     //     language == "en"
//     //       ? "Mobile Number not valid on above 10 number"
//     //       : "10 अंकी क्रमांकावरील मोबाईल क्रमांक वैध नाही"
//     //   )
//     //   .required(),
//     amobileNo: yup
//       // .string()
//       // .matches(/^[6-9]\d{9}$/, "Invalid mobile number")
//       // .required(
//       //   language == "en" ? "Please enter a mobile no. " : "कृपया मोबाईल नं. भरा"
//       // ),
//       .string()
//       .nullable()
//       .required(
//         language == "en"
//           ? "Contact Number is Required !!!"
//           : "संपर्क क्रमांक आवश्यक आहे !!!"
//       )
//       .matches(
//         /^[0-9]+$/,
//         language == "en"
//           ? "Must be only digits !!!"
//           : "फक्त अंक असणे आवश्यक आहे !!!"
//       )
//       .min(
//         10,
//         language == "en"
//           ? "Mobile Number must be 10 number"
//           : "मोबाईल क्रमांक 10 क्रमांकाचा असावा !!!"
//       )
//       .max(
//         10,
//         language == "en"
//           ? "Mobile Number must be 10 number"
//           : "मोबाईल नंबर 10 वरील नंबरवर वैध नाही !!!"
//       ),
//     aflatBuildingNo: yup
//       .string()
//       .matches(
//         /^[A-Za-z0-9@-\s]+$/,
//         language == "en" ? "Must be only in english " : " फक्त इंग्लिश मध्ये "
//       )
//       .required(<FormattedLabel id="enterFlat" />),
//     abuildingName: yup
//       .string()
//       .matches(
//         /^[A-Za-z0-9@-\s]+$/,
//         language == "en" ? "Must be only in english " : " फक्त इंग्लिश मध्ये "
//       )
//       .required(<FormattedLabel id="enterApartment" />),
//     aroadName: yup
//       .string()
//       .matches(
//         /^[A-Za-z0-9@-\s]+$/,
//         language == "en" ? "Must be only in english " : " फक्त इंग्लिश मध्ये "
//       )
//       .required(<FormattedLabel id="enterRoadName" />),
//     alandmark: yup
//       .string()
//       .matches(
//         /^[A-Za-z0-9@-\s]+$/,
//         language == "en" ? "Must be only in english " : " फक्त इंग्लिश मध्ये "
//       )
//       .required(<FormattedLabel id="enterLandmark" />),
//     aflatBuildingNoMr: yup
//       .string()
//       .matches(
//         /^[\u0900-\u097F]+/,
//         language == "en" ? "Must be only in marathi" : " फक्त मराठी मध्ये"
//       )
//       .required(<FormattedLabel id="enterFlatMr" />),
//     abuildingNameMr: yup
//       .string()
//       .matches(
//         /^[\u0900-\u097F]+/,
//         language == "en" ? "Must be only in marathi" : " फक्त मराठी मध्ये"
//       )
//       .required(<FormattedLabel id="enterApartmentMr" />),
//     aroadNameMr: yup
//       .string()
//       .matches(
//         /^[\u0900-\u097F]+/,
//         language == "en" ? "Must be only in marathi" : " फक्त मराठी मध्ये"
//       )
//       .required(<FormattedLabel id="enterRoadNameMr" />),
//     alandmarkMr: yup
//       .string()
//       .matches(
//         /^[\u0900-\u097F]+/,
//         language == "en" ? "Must be only in marathi" : " फक्त मराठी मध्ये"
//       )
//       .required(<FormattedLabel id="enterLandmarkMr" />),
//     acityName: yup
//       .string()
//       .matches(
//         /^[A-Za-z0-9@-\s]+$/,
//         language == "en"
//           ? "Must be only english characters "
//           : " फक्त इंग्लिश शब्द "
//       )
//       .required(<FormattedLabel id="enterCity" />),
//     astate: yup
//       .string()
//       .matches(
//         /^[A-Za-z0-9@-\s]+$/,
//         language == "en"
//           ? "Must be only english characters "
//           : " फक्त इंग्लिश शब्द "
//       )
//       .required(<FormattedLabel id="enterState" />),
//     acityNameMr: yup
//       .string()
//       .matches(
//         /^[\u0900-\u097F]+/,
//         language == "en"
//           ? "Must be only marathi characters"
//           : " फक्त मराठी शब्द"
//       )
//       .required(<FormattedLabel id="enterCityMr" />),
//     astateMr: yup
//       .string()
//       .matches(
//         /^[\u0900-\u097F]+/,
//         language == "en" ? "Must be only marathi characters" : "फक्त मराठी शब्द"
//       )
//       .required(<FormattedLabel id="stateMr" />),
//     apincode: yup
//       .string()
//       .matches(
//         /^[0-9]+$/,
//         language == "en" ? "Must be only digits" : "फक्त अंक असणे आवश्यक आहे"
//       )
//       .typeError(<FormattedLabel id="enterPinCode" />)
//       .min(
//         6,
//         language == "en"
//           ? "Pincode Number must be at least 6 number"
//           : "पिनकोड क्रमांक 12 क्रमांकाचा असणे आवश्यक आहे"
//       )
//       .max(
//         6,
//         language == "en"
//           ? "Pincode Number must be at Most 6 number"
//           : "पिनकोड क्रमांक 12 क्रमांकाचा असणे आवश्यक आहे"
//       )
//       .required(<FormattedLabel id="enterPinCode" />),

//     aadharNo: yup
//       .string()
//       .required(<FormattedLabel id="enteraadhaarNo" />)
//       .matches(
//         /^[0-9]+$/,
//         language == "en"
//           ? "only numbers are allowed"
//           : "फक्त संख्यांना परवानगी आहे"
//       )
//       .min(
//         12,
//         language == "en"
//           ? "Aadhar Number must be at least 12 number"
//           : "आधार क्रमांक किमान 12 क्रमांकाचा असणे आवश्यक आहे"
//       )
//       .max(
//         12,
//         language == "en"
//           ? "Aadhar Number not valid on above 12 number"
//           : "आधार क्रमांक १२ वरील क्रमांकावर वैध नाही"
//       )
//       .typeError(),

//     applicationDate: yup
//       .date()
//       .typeError(<FormattedLabel id="selectDate" />)
//       .required(),
//     membershipMonths: yup
//       .string()
//       .required(<FormattedLabel id="selectMembershipMonths" />),
//     // education: yup.string().required(<FormattedLabel id="educationEnter" />)
//     aadharCardDoc: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="identityProofMessage" />),
//     aadharCardDoc1: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="addressProofMessage" />),
//     photoAttachment: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="passportProofMessage" />),
//     taxReceipt: yup
//       .string()
//       .nullable()
//       .required(<FormattedLabel id="taxReceiptMessage" />),
//   });
// };
