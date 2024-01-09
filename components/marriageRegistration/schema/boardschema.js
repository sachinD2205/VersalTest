import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
const mobileval = "^[6-9][0-9]{9}$";

export let boardschema = (language) => {
  console.log("language", language);
  return yup.object().shape({
    // areaKey: yup.string().nullable().required("Please select a Area "),
    // .required(language == "en" ? "एरिया निवडा" : "Please select a Area "),

    zoneKey: yup.string().required(<FormattedLabel id="selectZone" />),
    wardKey: yup.string().required(<FormattedLabel id="selectWard" />),
    isPersonOrgansation: yup
      .string()
      .required(<FormattedLabel id="selectBoardType" />),
    //APPLICANT DETALS
    // atitle: yup.string().required(<FormattedLabel id="title1" />),
    afName: yup
      .string()
      .required(<FormattedLabel id="firstName" />)
      .matches(
        /^[A-Za-z@. \-\s]+$/,
        "Must be only english characters / फक्त इंग्लिश शब्द ",
      ),
    amName: yup
      .string()
      .required(<FormattedLabel id="middleName" />)
      .matches(
        /^[A-Za-z@. \-\s]+$/,
        "Must be only english characters / फक्त इंग्लिश शब्द ",
      ),
    alName: yup
      .string()
      .required(<FormattedLabel id="lastName" />)
      .matches(
        /^[A-Za-z@. \-\s]+$/,
        "Must be only english characters / फक्त इंग्लिश शब्द ",
      ),
    // atitlemr: yup.string().required(<FormattedLabel id="titlemr" />),
    afNameMr: yup
      .string()
      .required(<FormattedLabel id="firstNamemr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only marathi characters/ फक्त मराठी शब्द",
      ),
    amNameMr: yup
      .string()
      .required(<FormattedLabel id="middleNamemr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only marathi characters/ फक्त मराठी शब्द",
      ),
    alNameMr: yup
      .string()
      .required(<FormattedLabel id="lastNamemr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only marathi characters/ फक्त मराठी शब्द",
      ),

    //appliacnt data
    // aflatBuildingNo: yup
    //   .string()
    //   .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये ")
    //   .required(<FormattedLabel id="flatBuildingNo" />),
    // abuildingName: yup
    //   .string()
    //   .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये ")
    //   .required(<FormattedLabel id="buildingName" />),
    aroadName: yup
      .string()
      .required(<FormattedLabel id="roadName" />)
      .matches(
        /^[A-Za-z0-9@-\s]+$/,
        "Must be only in english / फक्त इंग्लिश मध्ये ",
      ),
    alandmark: yup
      .string()
      .required(<FormattedLabel id="Landmark" />)
      .matches(
        /^[A-Za-z0-9@-\s]+$/,
        "Must be only in english / फक्त इंग्लिश मध्ये ",
      ),
    acityName: yup
      .string()
      .required(<FormattedLabel id="cityName" />)
      .matches(
        /^[A-Za-z@. \-\s]+$/,
        "Must be only english characters / फक्त इंग्लिश शब्द ",
      ),
    astate: yup
      .string()
      .required("State is  required")
      .matches(
        /^[A-Za-z@. \-\s]+$/,
        "Must be only english characters / फक्त इंग्लिश शब्द ",
      ),

    // aflatBuildingNoMr: yup
    //   .string()
    //   .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी मध्ये")
    //   .required(<FormattedLabel id="flatBuildingNomr" />),
    // abuildingNameMr: yup
    //   .string()
    //   .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी मध्ये")
    //   .required(<FormattedLabel id="buildingNamemr" />),
    aroadNameMr: yup
      .string()
      .required(<FormattedLabel id="roadNamemr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only in marathi/ फक्त मराठी मध्ये",
      ),
    alandmarkMr: yup
      .string()
      .required(<FormattedLabel id="Landmarkmr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only in marathi/ फक्त मराठी मध्ये",
      ),
    acityNameMr: yup
      .string()
      .required(<FormattedLabel id="cityName" />)
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only in marathi/ फक्त मराठी मध्ये",
      ),
    astateMr: yup
      .string()
      .required(<FormattedLabel id="statemr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only in marathi/ फक्त मराठी मध्ये",
      ),
    apincode: yup
      .string()
      .required(<FormattedLabel id="pincode" />)
      .matches(
        /^[0-9]+$/,
        (language = "en" ? "Must be only digits" : "फक्त अंक असणे आवश्यक आहे"),
      )
      .min(
        6,
        (language = "en"
          ? "Enter minimum 6 digits"
          : "किमान 6 अंक प्रविष्ट करा"),
      ),
    // .max(6, <FormattedLabel id="pincodeV2" />),
    amobileNo: yup
      .string()
      .required(<FormattedLabel id="mobileNo" />)
      .matches(
        mobileval,
        (language = "en"
          ? "Enter a Valid Mobile Number"
          : "वैध मोबाईल नंबर टाका"),
      )
      .min(
        10,
        (language = "en"
          ? "Enter minimum 10 digits"
          : "किमान 10 अंक प्रविष्ट करा"),
      ),

    // .max(10, <FormattedLabel id="mobileV2" />),
    aemail: yup
      .string()
      .required(<FormattedLabel id="email" />)
      .email("Incorrect format"),
    //owner
    // otitle: yup.string().required(<FormattedLabel id="title1" />),
    ofName: yup
      .string()
      .required(<FormattedLabel id="firstName" />)
      .matches(
        /^[A-Za-z@. \-\s]+$/,
        "Must be only english characters / फक्त इंग्लिश शब्द ",
      ),
    omName: yup
      .string()
      .required(<FormattedLabel id="middleName" />)
      .matches(
        /^[A-Za-z@. \-\s]+$/,
        "Must be only english characters / फक्त इंग्लिश शब्द ",
      ),
    olName: yup
      .string()
      .required(<FormattedLabel id="lastName" />)
      .matches(
        /^[A-Za-z@. \-\s]+$/,
        "Must be only english characters / फक्त इंग्लिश शब्द ",
      ),
    // otitlemr: yup.string().required(<FormattedLabel id="titlemr" />),
    ofNameMr: yup
      .string()
      .required(<FormattedLabel id="firstNamemr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only marathi characters/ फक्त मराठी शब्द",
      ),
    omNameMr: yup
      .string()
      .required(<FormattedLabel id="middleNamemr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only marathi characters/ फक्त मराठी शब्द",
      ),
    olNameMr: yup
      .string()
      .required(<FormattedLabel id="lastNamemr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only marathi characters/ फक्त मराठी शब्द",
      ),
    //appliacnt data
    // oflatBuildingNo: yup
    //   .string()
    //   .required(<FormattedLabel id="flatBuildingNo" />)
    //   .matches(
    //     /^[A-Za-z0-9@-\s]+$/,
    //     "Must be only in english / फक्त इंग्लिश मध्ये ",
    //   ),
    // obuildingName: yup
    //   .string()
    //   .required(<FormattedLabel id="buildingName" />)
    //   .matches(
    //     /^[A-Za-z0-9@-\s]+$/,
    //     "Must be only in english / फक्त इंग्लिश मध्ये ",
    //   ),
    oroadName: yup
      .string()
      .required(<FormattedLabel id="roadName" />)
      .matches(
        /^[A-Za-z0-9@-\s]+$/,
        "Must be only in english / फक्त इंग्लिश मध्ये ",
      ),
    olandmark: yup
      .string()
      .required(<FormattedLabel id="Landmark" />)
      .matches(
        /^[A-Za-z0-9@-\s]+$/,
        "Must be only in english / फक्त इंग्लिश मध्ये ",
      ),
    ocityName: yup
      .string()
      .required(<FormattedLabel id="cityName" />)
      .matches(
        /^[A-Za-z0-9@-\s]+$/,
        "Must be only in english / फक्त इंग्लिश मध्ये ",
      ),
    ostate: yup
      .string()
      .required(<FormattedLabel id="state" />)
      .matches(
        /^[A-Za-z0-9@-\s]+$/,
        "Must be only in english / फक्त इंग्लिश मध्ये ",
      ),
    // oflatBuildingNoMr: yup
    //   .string()
    //   .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी मध्ये")
    //   .required(<FormattedLabel id="flatBuildingNomr" />),
    // obuildingNameMr: yup
    //   .string()
    //   .required(<FormattedLabel id="buildingNamemr" />)
    //   .matches(
    //     /^[\u0900-\u097F]+/,
    //     "Must be only in marathi/ फक्त मराठी मध्ये",
    //   ),
    oroadNameMr: yup
      .string()
      .required(<FormattedLabel id="roadNamemr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only in marathi/ फक्त मराठी मध्ये",
      ),
    olandmarkMr: yup
      .string()
      .required(<FormattedLabel id="Landmarkmr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only in marathi/ फक्त मराठी मध्ये",
      ),
    ocityNameMr: yup
      .string()
      .required(<FormattedLabel id="cityName" />)
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only in marathi/ फक्त मराठी मध्ये",
      ),
    ostateMr: yup
      .string()
      .required(<FormattedLabel id="statemr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only in marathi/ फक्त मराठी मध्ये",
      ),
    opincode: yup
      .string()
      .required(<FormattedLabel id="pincode" />)
      .matches(
        /^[0-9]+$/,
        (language = "en" ? "Must be only digits" : "फक्त अंक असणे आवश्यक आहे"),
      )
      .min(
        6,
        (language = "en"
          ? "Enter minimum 6 digits"
          : "किमान 6 अंक प्रविष्ट करा"),
      ),
    // .max(6, <FormattedLabel id="pincodeV2" />),
    omobileNo: yup
      .string()
      .required(<FormattedLabel id="mobileNo" />)
      .matches(
        mobileval,
        (language = "en"
          ? "Enter a Valid Mobile Number"
          : "वैध मोबाईल नंबर टाका"),
      )
      .min(
        10,
        (language = "en"
          ? "Enter minimum 10 digits"
          : "किमान 10 अंक प्रविष्ट करा"),
      ),

    // .max(10, <FormattedLabel id="mobileV2" />),
    oemail: yup
      .string()
      .required(<FormattedLabel id="email" />)
      .email("Incorrect format"),
    //board details
    marriageBoardName: yup
      .string()
      .required(<FormattedLabel id="boardName" />)
      .matches(
        /^[A-Za-z0-9@-\s]+$/,
        "Must be only in english / फक्त इंग्लिश मध्ये ",
      ),
    marriageBoardNameMr: yup
      .string()
      .required(<FormattedLabel id="boardNamemr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only in marathi/ फक्त मराठी मध्ये",
      ),
    // bflatBuildingNo: yup
    //   .string()
    //   .required(<FormattedLabel id="flatBuildingNo" />)
    //   .matches(
    //     /^[A-Za-z0-9@-\s]+$/,
    //     "Must be only in english / फक्त इंग्लिश मध्ये ",
    //   ),
    // bbuildingName: yup
    //   .string()
    //   .required(<FormattedLabel id="buildingName" />)
    //   .matches(
    //     /^[A-Za-z0-9@-\s]+$/,
    //     "Must be only in english / फक्त इंग्लिश मध्ये ",
    //   ),
    broadName: yup
      .string()
      .required(<FormattedLabel id="roadName" />)
      .matches(
        /^[A-Za-z0-9@-\s]+$/,
        "Must be only in english / फक्त इंग्लिश मध्ये ",
      ),
    blandmark: yup
      .string()
      .required(<FormattedLabel id="Landmark" />)
      .matches(
        /^[A-Za-z0-9@-\s]+$/,
        "Must be only in english / फक्त इंग्लिश मध्ये ",
      ),
    city: yup
      .string()
      .required(<FormattedLabel id="cityName" />)
      .matches(
        /^[A-Za-z0-9@-\s]+$/,
        "Must be only in english / फक्त इंग्लिश मध्ये ",
      ),
    bpincode: yup
      .string()
      .required(<FormattedLabel id="pincode" />)
      .matches(
        /^[0-9]+$/,
        (language = "en" ? "Must be only digits" : "फक्त अंक असणे आवश्यक आहे"),
      )
      .min(
        6,
        (language = "en"
          ? "Enter minimum 6 digits"
          : "किमान 6 अंक प्रविष्ट करा"),
      ),
    // .max(6, <FormattedLabel id="pincodeV2" />),
    // bflatBuildingNoMr: yup
    //   .string()
    //   .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी मध्ये")
    //   .required(<FormattedLabel id="flatBuildingNomr" />),
    // bbuildingNameMr: yup
    //   .string()
    //   .required(<FormattedLabel id="buildingNamemr" />)
    //   .matches(
    //     /^[\u0900-\u097F]+/,
    //     "Must be only in marathi/ फक्त मराठी मध्ये",
    //   ),
    broadNameMr: yup
      .string()
      .required(<FormattedLabel id="roadNamemr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only in marathi/ फक्त मराठी मध्ये",
      ),
    blandmarkMr: yup
      .string()
      .required(<FormattedLabel id="Landmarkmr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only in marathi/ फक्त मराठी मध्ये",
      ),
    cityMr: yup
      .string()
      .required(<FormattedLabel id="cityNamemr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only in marathi/ फक्त मराठी मध्ये",
      ),
    aadhaarNo: yup
      .string()
      .required(<FormattedLabel id="AadharNo" />)
      .matches(
        /^[0-9]+$/,
        (language = "en" ? "Must be only digits" : "फक्त अंक असणे आवश्यक आहे"),
      )
      .min(
        12,
        (language = "en"
          ? "Enter minimum 12 digits"
          : "किमान 12 अंक प्रविष्ट करा"),
      ),

    mobile: yup
      .string()
      .required(<FormattedLabel id="mobileNo" />)
      .matches(
        mobileval,
        (language = "en"
          ? "Enter a Valid Mobile Number"
          : "वैध मोबाईल नंबर टाका"),
      )
      .min(10, <FormattedLabel id="mobileV1" />)
      .max(10, <FormattedLabel id="mobileV2" />),
    emailAddress: yup
      .string()
      .required(<FormattedLabel id="email" />)
      .email("Incorrect format"),

    //document validation
    boardHeadPersonPhoto: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="boardheadphotoV" />),

    boardOrganizationPhoto: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="boardorgphotocpyV" />),

    panCard: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="panCardV" />),

    aadharCard: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="adharcardV" />),

    // rationCard: yup
    // .string()
    // .nullable()
    // .required(<FormattedLabel id="rationcardV" />),

    // electricityBill: yup
    // .string()
    // .nullable()
    // .required(<FormattedLabel id="electricBillV" />),

    // otherDoc: yup
    // .string()
    // .nullable()
    // .required(<FormattedLabel id="otherDocumentV" />),

    // boardHeadPersonPhoto: yup
    //   .mixed()
    //   .required("File is required")
    //   // .test("fileSize", "File size too large", (value) => {
    //   //   console.log("value 32423423", value.size);
    //   //   return value && value.size <= 2000000; // 2MB
    //   // })
    //   .test("fileType", "Unsupported file type", (value) => {
    //     return value && ["image/jpeg", "image/png"].includes(value.type);
    //   }),
  });
};
