import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let modOfboardschema = yup.object().shape({
  zoneKey: yup.string().required(<FormattedLabel id="selectZone" />),
  wardKey: yup.string().required(<FormattedLabel id="selectWard" />),
  //APPLICANT DETALS
  // atitle: yup.string().required(<FormattedLabel id="title1" />),
  afName: yup
    .string()
    .required(<FormattedLabel id="firstName" />)
    .matches(
      /^[aA-zZ\s]+$/,
      "Must be only english characters / फक्त इंग्लिश शब्द ",
    ),

  amName: yup
    .string()
    .required(<FormattedLabel id="middleName" />)
    .matches(
      /^[aA-zZ\s]+$/,
      "Must be only english characters / फक्त इंग्लिश शब्द ",
    ),

  alName: yup
    .string()
    .required(<FormattedLabel id="lastName" />)
    .matches(
      /^[aA-zZ\s]+$/,
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
  //appliacnt data address
  // aflatBuildingNo: yup
  //   .string()
  //   .required(<FormattedLabel id="flatBuildingNo" />),
  // abuildingName: yup
  //   .string()
  //   // .matches(
  //   //   /^[aA-zZ\s]+$/,
  //   //   'Must be only english characters / फक्त इंग्लिश शब्द ',
  //   // )
  //   .required(<FormattedLabel id="buildingName" />),
  aroadName: yup
    .string()
    // .matches(
    //   /^[aA-zZ\s]+$/,
    //   'Must be only english characters / फक्त इंग्लिश शब्द ',
    // )
    .required(<FormattedLabel id="roadName" />),
  alandmark: yup
    .string()
    // .matches(
    //   /^[aA-zZ\s]+$/,
    //   'Must be only english characters / फक्त इंग्लिश शब्द ',
    // )
    .required(<FormattedLabel id="Landmark" />),
  acityName: yup
    .string()
    // .matches(
    //   /^[aA-zZ\s]+$/,
    //   'Must be only english characters / फक्त इंग्लिश शब्द ',
    // )
    .required(<FormattedLabel id="cityName" />),
  astate: yup
    .string()
    // .matches(
    //   /^[aA-zZ\s]+$/,
    //   'Must be only english characters / फक्त इंग्लिश शब्द ',
    // )
    .required(<FormattedLabel id="state" />),
  // aflatBuildingNoMr: yup
  //   .string()
  //   .required(<FormattedLabel id="flatBuildingNomr" />),
  // abuildingNameMr: yup
  //   .string()
  //   .required(<FormattedLabel id="buildingNamemr" />),
  aroadNameMr: yup.string().required(<FormattedLabel id="roadNamemr" />),
  alandmarkMr: yup.string().required(<FormattedLabel id="Landmarkmr" />),
  acityNameMr: yup.string().required(<FormattedLabel id="cityName" />),
  astateMr: yup.string().required(<FormattedLabel id="statemr" />),
  apincode: yup
    .string()
    .required(<FormattedLabel id="pincode" />)
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(6, "Pincode Number must be at least 6 number")
    .max(6, "Pincode Number not valid on above 6 number"),
  amobileNo: yup
    .string()
    .required(<FormattedLabel id="mobileNo" />)
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Mobile Number must be at least 10 number")
    .max(10, "Mobile Number not valid on above 10 number"),
  aemail: yup
    .string()
    .required(<FormattedLabel id="email" />)
    .email("Incorrect format"),
  // //owner
  // otitle: yup.string().required(<FormattedLabel id="title1" />),
  // ofName: yup
  //   .string()
  //   .matches(
  //     /^[aA-zZ\s]+$/,
  //     'Must be only english characters / फक्त इंग्लिश शब्द ',
  //   )
  //   .required(<FormattedLabel id="firstName" />),
  // omName: yup
  //   .string()
  //   .matches(
  //     /^[aA-zZ\s]+$/,
  //     'Must be only english characters / फक्त इंग्लिश शब्द ',
  //   )
  //   .required(<FormattedLabel id="middleName" />),
  // olName: yup
  //   .string()
  //   .matches(
  //     /^[aA-zZ\s]+$/,
  //     'Must be only english characters / फक्त इंग्लिश शब्द ',
  //   )
  //   .required(<FormattedLabel id="lastName" />),
  // otitlemr: yup.string().required(<FormattedLabel id="titlemr" />),
  // ofNameMr: yup
  //   .string()
  //   .matches(
  //     /^[\u0900-\u097F]+/,
  //     'Must be only marathi characters/ फक्त मराठी शब्द',
  //   )
  //   .required(<FormattedLabel id="firstNamemr" />),
  // omNameMr: yup
  //   .string()
  //   .matches(
  //     /^[\u0900-\u097F]+/,
  //     'Must be only marathi characters/ फक्त मराठी शब्द',
  //   )
  //   .required(<FormattedLabel id="middleNamemr" />),
  // olNameMr: yup
  //   .string()
  //   .matches(
  //     /^[\u0900-\u097F]+/,
  //     'Must be only marathi characters/ फक्त मराठी शब्द',
  //   )
  //   .required(<FormattedLabel id="lastNamemr" />),
  // //appliacnt data
  // oflatBuildingNo: yup
  //   .string()
  //   .required(<FormattedLabel id="flatBuildingNo" />),
  // obuildingName: yup.string().required(<FormattedLabel id="buildingName" />),
  // oroadName: yup.string().required(<FormattedLabel id="roadName" />),
  // olandmark: yup.string().required(<FormattedLabel id="Landmark" />),
  // ocityName: yup.string().required(<FormattedLabel id="cityName" />),
  // ostate: yup.string().required(<FormattedLabel id="state" />),
  // oflatBuildingNoMr: yup
  //   .string()
  //   .required(<FormattedLabel id="flatBuildingNomr" />),
  // obuildingNameMr: yup
  //   .string()
  //   .required(<FormattedLabel id="buildingNamemr" />),
  // oroadNameMr: yup.string().required(<FormattedLabel id="roadNamemr" />),
  // olandmarkMr: yup.string().required(<FormattedLabel id="Landmarkmr" />),
  // ocityNameMr: yup.string().required(<FormattedLabel id="cityName" />),
  // ostateMr: yup.string().required(<FormattedLabel id="statemr" />),
  // opincode: yup
  //   .string()
  //   .matches(/^[0-9]+$/, 'Must be only digits')
  //   .min(6, 'Pincode Number must be at least 6 number')
  //   .max(6, 'Pincode Number not valid on above 6 number')
  //   .required(<FormattedLabel id="pincode" />),
  // omobileNo: yup
  //   .string()
  //   .matches(/^[0-9]+$/, 'Must be only digits')
  //   .min(10, 'Mobile Number must be at least 10 number')
  //   .max(10, 'Mobile Number not valid on above 10 number')
  //   .required(<FormattedLabel id="mobileNo" />),
  // oemail: yup
  //   .string()
  //   .email('Incorrect format')
  //   .required(<FormattedLabel id="email" />),
  // //owner in modification
  // otitleM: yup.string().required(<FormattedLabel id="title1" />),
  ofNameM: yup
    .string()
    .required(<FormattedLabel id="firstName" />)
    .matches(
      /^[aA-zZ\s]+$/,
      "Must be only english characters / फक्त इंग्लिश शब्द ",
    ),
  omNameM: yup
    .string()
    .required(<FormattedLabel id="middleName" />)
    .matches(
      /^[aA-zZ\s]+$/,
      "Must be only english characters / फक्त इंग्लिश शब्द ",
    ),
  olNameM: yup
    .string()
    .required(<FormattedLabel id="lastName" />)
    .matches(
      /^[aA-zZ\s]+$/,
      "Must be only english characters / फक्त इंग्लिश शब्द ",
    ),
  // otitlemrM: yup.string().required(<FormattedLabel id="titlemr" />),
  ofNameMrM: yup
    .string()
    .required(<FormattedLabel id="firstNamemr" />)
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द",
    ),
  omNameMrM: yup
    .string()
    .required(<FormattedLabel id="middleNamemr" />)
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द",
    ),
  olNameMrM: yup
    .string()
    .required(<FormattedLabel id="lastNamemr" />)
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द",
    ),
  // oflatBuildingNoM: yup
  //   .string()
  //   .required(<FormattedLabel id="flatBuildingNo" />),
  // obuildingNameM: yup.string().required(<FormattedLabel id="buildingName" />),
  oroadNameM: yup.string().required(<FormattedLabel id="roadName" />),
  olandmarkM: yup.string().required(<FormattedLabel id="Landmark" />),
  ocityNameM: yup.string().required(<FormattedLabel id="cityName" />),
  ostateM: yup.string().required(<FormattedLabel id="state" />),
  // oflatBuildingNoMrM: yup
  //   .string()
  //   .required(<FormattedLabel id="flatBuildingNomr" />),
  // obuildingNameMrM: yup
  //   .string()
  //   .required(<FormattedLabel id="buildingNamemr" />),
  oroadNameMrM: yup.string().required(<FormattedLabel id="roadNamemr" />),
  olandmarkMrM: yup.string().required(<FormattedLabel id="Landmarkmr" />),
  ocityNameMrM: yup.string().required(<FormattedLabel id="cityName" />),
  ostateMrM: yup.string().required(<FormattedLabel id="statemr" />),
  // // opincode: yup
  // //   .string()
  // //   .matches(/^[0-9]+$/, 'Must be only digits')
  // //   .min(6, 'Pincode Number must be at least 6 number')
  // //   .max(6, 'Pincode Number not valid on above 6 number')
  // //   .required(<FormattedLabel id="pincode" />),
  // // omobileNo: yup
  // //   .string()
  // //   .matches(/^[0-9]+$/, 'Must be only digits')
  // //   .min(10, 'Mobile Number must be at least 10 number')
  // //   .max(10, 'Mobile Number not valid on above 10 number')
  // //   .required(<FormattedLabel id="mobileNo" />),
  // // oemail: yup
  // //   .string()
  // //   .email('Incorrect format')
  // //   .required(<FormattedLabel id="email" />),
  //board details
  // marriageBoardName: yup.string().required(<FormattedLabel id="boardName" />),
  // marriageBoardNameMr: yup
  //   .string()
  //   .required(<FormattedLabel id="boardNamemr" />),
  // bflatBuildingNo: yup
  //   .string()
  //   .required(<FormattedLabel id="flatBuildingNo" />),
  // bbuildingName: yup.string().required(<FormattedLabel id="buildingName" />),
  // broadName: yup.string().required(<FormattedLabel id="roadName" />),
  // blandmark: yup.string().required(<FormattedLabel id="Landmark" />),
  // city: yup.string().required(<FormattedLabel id="cityName" />),
  // bpincode: yup
  //   .string()
  //   .matches(/^[0-9]+$/, 'Must be only digits')
  //   .min(6, 'Pincode Number must be at least 6 number')
  //   .max(6, 'Pincode Number not valid on above 6 number')
  //   .required(<FormattedLabel id="pincode" />),
  // bflatBuildingNoMr: yup
  //   .string()
  //   .required(<FormattedLabel id="flatBuildingNomr" />),
  // bbuildingNameMr: yup
  //   .string()
  //   .required(<FormattedLabel id="buildingNamemr" />),
  // broadNameMr: yup.string().required(<FormattedLabel id="roadNamemr" />),
  // blandmarkMr: yup.string().required(<FormattedLabel id="Landmarkmr" />),
  // cityMr: yup.string().required(<FormattedLabel id="cityNamemr" />),
  // aadhaarNo: yup
  //   .string()
  //   .matches(/^[0-9]+$/, 'Must be only digits')
  //   .min(12, 'Adhar Number must be at least 12 number')
  //   .max(12, 'Adhar Number not valid on above 12 number')
  //   .required(<FormattedLabel id="AadharNo" />),
  // mobile: yup
  //   .string()
  //   .matches(/^[0-9]+$/, 'Must be only digits')
  //   .min(10, 'Mobile Number must be at least 10 number')
  //   .max(10, 'Mobile Number not valid on above 10 number')
  //   .required(<FormattedLabel id="mobileNo" />),
  // emailAddress: yup
  //   .string()
  //   .email('Incorrect format')
  //   .required(<FormattedLabel id="email" />),
  //board modification
  marriageBoardNameM: yup.string().required(<FormattedLabel id="boardName" />),
  marriageBoardNameMrM: yup
    .string()
    .required(<FormattedLabel id="boardNamemr" />),
  // bflatBuildingNoM: yup
  //   .string()
  //   .required(<FormattedLabel id="flatBuildingNo" />),
  // bbuildingNameM: yup.string().required(<FormattedLabel id="buildingName" />),
  broadNameM: yup.string().required(<FormattedLabel id="roadName" />),
  blandmarkM: yup.string().required(<FormattedLabel id="Landmark" />),
  cityM: yup.string().required(<FormattedLabel id="cityName" />),
  bpincodeM: yup
    .string()
    .required(<FormattedLabel id="pincode" />)
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(6, "Pincode Number must be at least 6 number")
    .max(6, "Pincode Number not valid on above 6 number"),
  // bflatBuildingNoMrM: yup
  //   .string()
  //   .required(<FormattedLabel id="flatBuildingNomr" />),
  // bbuildingNameMrM: yup
  //   .string()
  //   .required(<FormattedLabel id="buildingNamemr" />),
  broadNameMrM: yup.string().required(<FormattedLabel id="roadNamemr" />),
  blandmarkMrM: yup.string().required(<FormattedLabel id="Landmarkmr" />),
  cityMrM: yup.string().required(<FormattedLabel id="cityNamemr" />),
  aadhaarNoM: yup
    .string()
    .required(<FormattedLabel id="AadharNo" />)
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(12, "Adhar Number must be at least 12 number")
    .max(12, "Adhar Number not valid on above 12 number"),
  oldBoardCertificateMod: yup
    .string()
    .required(<FormattedLabel id="oldBoardCertificate" />),
  boardHeadPersonPhotoMod: yup
    .string()
    .required(<FormattedLabel id="boardHeadPersonPhotoMod" />),
  boardOrganizationPhotoMod: yup
    .string()
    .required(<FormattedLabel id="boardOrganizationPhotoMod" />),
  panCardMod: yup.string().required(<FormattedLabel id="panCardMod" />),
  aadharCardMod: yup.string().required(<FormattedLabel id="aadharCardMod" />),
  // mobileM: yup
  //   .string()
  //   .required(<FormattedLabel id="mobileNo" />)
  //   .matches(/^[0-9]+$/, 'Must be only digits')
  //   .min(10, 'Mobile Number must be at least 10 number')
  //   .max(10, 'Mobile Number not valid on above 10 number'),
  // emailAddressM: yup
  //   .string()
  //   .required(<FormattedLabel id="email" />)
  //   .email('Incorrect format'),
  // boardOrganizationPhoto: yup
  //   .string()
  //   .required(<FormattedLabel id="boardOrganizationPhotoMod" />),
  // residentialProof: yup
  //   .string()
  //   .required(<FormattedLabel id="residentialProofMod" />),
  // identityProof: yup
  //   .string()
  //   .required(<FormattedLabel id="identityProofMod" />),
  // boardOrganizationPhotoMod: yup
  //   .string()
  //   .required(<FormattedLabel id="boardOrganizationPhotoMod" />),
  // residentialProofMod: yup
  //   .string()
  //   .required(<FormattedLabel id="residentialProofMod" />),
  // identityProofMod: yup
  //   .string()
  //   .required(<FormattedLabel id="identityProofMod" />),
});

export default modOfboardschema;
