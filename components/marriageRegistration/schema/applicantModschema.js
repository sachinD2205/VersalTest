import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// modification
let applicantModschema = yup.object().shape({
  //marriage details
  marriageDateM: yup
    .date()
    .typeError(<FormattedLabel id="selectDate" />)
    .required(),
  pplaceOfMarriageM: yup
    .string()
    .matches(
      /^[A-Za-z0-9@.,\-\s]+$/,
      "Must be only english characters / फक्त इंग्लिश शब्द ",
    )
    .required(<FormattedLabel id="placeMarriage" />),
  pplaceOfMarriageMrM: yup
    .string()
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द",
    )
    .required(<FormattedLabel id="placeMarriageMr" />),

  //groom details
  // gtitleM: yup.string().required(<FormattedLabel id="selectTitle" />),
  gfNameM: yup
    .string()
    .matches(
      /^[aA-zZ\s]+$/,
      "Must be only english characters / फक्त इंग्लिश शब्द ",
    )
    .required(<FormattedLabel id="enterFName" />),
  gmNameM: yup
    .string()
    .matches(
      /^[aA-zZ\s]+$/,
      "Must be only english characters / फक्त इंग्लिश शब्द ",
    )
    .required(<FormattedLabel id="enterMName" />),
  glNameM: yup
    .string()
    .matches(
      /^[aA-zZ\s]+$/,
      "Must be only english characters / फक्त इंग्लिश शब्द ",
    )
    .required(<FormattedLabel id="enterLName" />),
  // gtitleMarM: yup.string().required(<FormattedLabel id="selectTitle" />),
  gfNameMrM: yup
    .string()
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द",
    )
    .required(<FormattedLabel id="enterFNameMr" />),
  gmNameMrM: yup
    .string()
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द",
    )
    .required(<FormattedLabel id="enterMNameMr" />),
  glNameMrM: yup
    .string()
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द",
    )
    .required(<FormattedLabel id="enterLNameMr" />),

  // gbuildingNoM: yup
  //   .string()
  //   .matches(
  //     /^[A-Za-z0-9@.,\-\s]+$/,
  //     "Must be only in english / फक्त इंग्लिश मध्ये ",
  //   ),
  // .required(<FormattedLabel id="enterFlat" />),
  // gbuildingNameM: yup
  //   .string()
  //   .matches(
  //     /^[A-Za-z0-9@.,\-\s]+$/,
  //     "Must be only in english / फक्त इंग्लिश मध्ये ",
  //   ),
  // .required(<FormattedLabel id="enterApartment" />),
  groadNameM: yup
    .string()
    .matches(
      /^[A-Za-z0-9@.,\-\s]+$/,
      "Must be only in english / फक्त इंग्लिश मध्ये ",
    )
    .required(<FormattedLabel id="enterRoadName" />),
  glandmarkM: yup
    .string()
    .matches(
      /^[A-Za-z0-9@.,\-\s]+$/,
      "Must be only in english / फक्त इंग्लिश मध्ये ",
    )
    .required(<FormattedLabel id="enterLandmark" />),
  // gbuildingNoMrM: yup
  //   .string()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी शब्द"),
  // .required(<FormattedLabel id="enterFlatMr" />),
  // gbuildingNameMrM: yup
  //   .string()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी शब्द"),
  // .required(<FormattedLabel id="enterApartmentMr" />),
  groadNameMrM: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी शब्द")
    .required(<FormattedLabel id="enterRoadNameMr" />),
  glandmarkMrM: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी शब्द")
    .required(<FormattedLabel id="enterLandmarkMr" />),
  gcityNameM: yup
    .string()
    .matches(
      /^[A-Za-z0-9@.,\-\s]+$/,
      "Must be only english characters / फक्त इंग्लिश शब्द ",
    )
    .required(<FormattedLabel id="enterCity" />),
  gstateM: yup
    .string()
    // .required(<FormattedLabel id="state" />)
    .matches(
      /^[A-Za-z0-9@.,\-\s]+$/,
      "Must be only english characters / फक्त इंग्लिश शब्द ",
    ),
  gcityNameMrM: yup
    .string()
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द",
    )
    .required(<FormattedLabel id="enterCityMr" />),
  gstateMrM: yup
    .string()
    // .required(<FormattedLabel id="stateMr" />)
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द",
    ),
  gpincodeM: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .typeError(<FormattedLabel id="enterPinCode" />)
    .min(6, "Pincode Number must be at least 6 number")
    .max(6, "Pincode Number not valid on above 6 number")
    .required(),
  // .number()
  gmobileNoM: yup
    .string()
    .matches(/^[6-9][0-9]+$/, "Enter Valid Mobile Number")
    .typeError(<FormattedLabel id="enteraadhaarNo" />)
    // .min(10, 'Mobile Number must be at least 10 number')
    .max(10, "Mobile Number not valid on above 10 number"),
  gaadharNoM: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .typeError(<FormattedLabel id="enteraadhaarNo" />)
    .min(12, "Adhar Number must be at least 12 number")
    .max(12, "Adhar Number not valid on above 12 number")
    .required(),

  // btitleM: yup.string().required(<FormattedLabel id="selectTitle" />),
  bfNameM: yup
    .string()
    .matches(
      /^[aA-zZ\s]+$/,
      "Must be only english characters / फक्त इंग्लिश शब्द ",
    )
    .required(<FormattedLabel id="enterFName" />),
  bmNameM: yup
    .string()
    .matches(
      /^[aA-zZ\s]+$/,
      "Must be only english characters / फक्त इंग्लिश शब्द ",
    )
    .required(<FormattedLabel id="enterMName" />),
  blNameM: yup
    .string()
    .matches(
      /^[aA-zZ\s]+$/,
      "Must be only english characters / फक्त इंग्लिश शब्द ",
    )
    .required(<FormattedLabel id="enterLName" />),

  // btitleMarM: yup.string().required(<FormattedLabel id="selectTitle" />),
  bfNameMrM: yup
    .string()
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द",
    )
    .required(<FormattedLabel id="enterFNameMr" />),
  bmNameMrM: yup
    .string()
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द",
    )
    .required(<FormattedLabel id="enterMNameMr" />),
  blNameMrM: yup
    .string()
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द",
    )
    .required(<FormattedLabel id="enterLNameMr" />),
  //badress
  // bbuildingNoM: yup
  //   .string()
  //   .matches(
  //     /^[A-Za-z0-9@.,\-\s]+$/,
  //     "Must be only in english / फक्त इंग्लिश मध्ये ",
  //   ),
  // .required(<FormattedLabel id="enterFlat" />),
  // bbuildingNameM: yup
  //   .string()
  //   .matches(
  //     /^[A-Za-z0-9@.,\-\s]+$/,
  //     "Must be only in english / फक्त इंग्लिश मध्ये ",
  //   ),
  // .required(<FormattedLabel id="enterApartment" />),
  broadNameM: yup
    .string()
    .matches(
      /^[A-Za-z0-9@.,\-\s]+$/,
      "Must be only in english / फक्त इंग्लिश मध्ये ",
    )
    .required(<FormattedLabel id="enterRoadName" />),
  blandmarkM: yup
    .string()
    .matches(
      /^[A-Za-z0-9@.,\-\s]+$/,
      "Must be only in english / फक्त इंग्लिश मध्ये ",
    )
    .required(<FormattedLabel id="enterLandmark" />),

  // bbuildingNoMrM: yup
  //   .string()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी शब्द"),
  // .required(<FormattedLabel id="enterFlatMr" />),
  // bbuildingNameMrM: yup
  //   .string()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी शब्द"),
  // .required(<FormattedLabel id="enterApartmentMr" />),
  broadNameMrM: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी शब्द")
    .required(<FormattedLabel id="enterRoadNameMr" />),
  blandmarkMrM: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी शब्द")
    .required(<FormattedLabel id="enterLandmarkMr" />),

  bcityNameM: yup
    .string()
    .matches(
      /^[A-Za-z0-9@.,\-\s]+$/,
      "Must be only english characters / फक्त इंग्लिश शब्द ",
    )
    .required(<FormattedLabel id="enterCity" />),
  bstateM: yup
    .string()
    // .required(<FormattedLabel id="state" />)
    .matches(
      /^[A-Za-z0-9@.,\-\s]+$/,
      "Must be only english characters / फक्त इंग्लिश शब्द ",
    ),
  bcityNameMrM: yup
    .string()
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द",
    )
    .required(<FormattedLabel id="enterCityMr" />),
  bstateMrM: yup
    .string()
    // .required(<FormattedLabel id="stateMr" />)
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द",
    ),
  bpincodeM: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .typeError(<FormattedLabel id="enterPinCode" />)
    .min(6, "Pincode Number must be at least 6 number")
    .max(6, "Pincode Number not valid on above 6 number")
    .required(),
  bmobileNoM: yup
    .string()
    .matches(/^[6-9][0-9]+$/, "Enter Valid Mobile Number")
    .typeError(<FormattedLabel id="enteraadhaarNo" />)
    // .min(10, 'Mobile Number must be at least 10 number')
    .max(10, "Mobile Number not valid on above 10 number"),
  // // .required(),
  baadharNoM: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .typeError(<FormattedLabel id="enteraadhaarNo" />)
    .min(12, "Adhar Number must be at least 12 number")
    .max(12, "Adhar Number not valid on above 12 number")
    .required(),

  // bbirthDate: yup
  //   .date()
  //   .typeError(<FormattedLabel id="selectDate" />)
  //   .required(),
  // bage: yup
  //   .number()
  //   .typeError()
  //   .min(18, "Age must be at least 18 year")
  //   .max(99, "Age not valid on above 18 year")
  //   .required(<FormattedLabel id="enterAge" />),
  // bgender: yup.string().required(<FormattedLabel id="selectGender" />),

  // bemail: yup.string().email("Incorrect format"),
  // // .required(<FormattedLabel id="enterEmailAddress" />),
  // breligionByBirth: yup
  //   .string()
  //   .required(<FormattedLabel id="selectReligionby" />),
  // breligionByAdoption: yup
  //   .string()
  //   .required(<FormattedLabel id="selectAdoptionby" />),
  // bstatusAtTimeMarriageKey: yup
  //   .string()
  //   .required(<FormattedLabel id="selectStatusAt" />),

  // bpincode: yup
  //   .string()
  //   .matches(/^[0-9]+$/, "Must be only digits")
  //   .typeError(<FormattedLabel id="enterPinCode" />)
  //   .min(6, "Pincode Number must be at least 6 number")
  //   .max(6, "Pincode Number not valid on above 6 number")
  //   .required(),
  // bmobileNo: yup
  //   .string()
  //   .matches(/^[0-9]*$/, "Must be only digits")
  //   .typeError(<FormattedLabel id="enteraadhaarNo" />)
  //   // .min(10, 'Mobile Number must be at least 10 number')
  //   .max(10, "Mobile Number not valid on above 10 number"),
  // // // .required(),

  // isApplicantGroomMod: yup
  //   .boolean()
  //   .oneOf([true], "Please check the checkbox."),

  oldMarriageCerModDocument: yup
    .string()
    .required("Old Marriage Certificate / जुने लग्न प्रमाणपत्र"),
});

export default applicantModschema;
