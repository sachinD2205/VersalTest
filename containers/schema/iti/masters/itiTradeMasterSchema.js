import * as yup from "yup";

// schema - validation for ITI master
let itiTradeMasterSchema = yup.object().shape({
  itiKey: yup.string().required("ITI name is Required"),
  tradeName: yup.string().matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्द ").required("Trade name is Required"),

  tradeDuration: yup
    .string()
    .required("Trade Duration is Required")
    .matches(/^[0-9]+$/, "Must be only digits"),

  tradeUnit: yup.string().required("Trade Unit is Required"),
  tradeAffiliationNo: yup
    .string()
    .required("Trade Affiliation Number is Required"),
  tradeType: yup.string().required("Trade Type is Required"),

  tradeDescription: yup.string().required("Trade Description is Required"),
  intake: yup
    .string()
    .required("Intake Capacity is Required")
    .matches(/^[0-9]+$/, "Must be only digits"),
  // .matches(/^[0-9]+$/, "Must be only digits"),
  //   itiPrefix: yup.string().required("ITI Prefix is Required"),
  //   intake: yup
  //     .string()
  //     .matches(/^[0-9]+$/, "Must be only digits")
  //     .required("Intakeis Required"),
  //   emailId: yup.string().email("Incorrect format").required("EmailID id Required"),
  //   contactPerson: yup.string().required("Contact Person Name is Required"),
  //   contactNumber: yup
  //     .string()
  //     .matches(/^[0-9]+$/, "Must be only digits")
  //     .min(10, "Mobile Number must be 10 number")
  //     .max(10, "Mobile Number not valid on above 10 number")
  //     .required("Enter school contact person Mobile Number"),
  //   address: yup.string().required("ITI Address is Required"),
  //   pincode: yup
  //     .string()
  //     .matches(/^[0-9]+$/, "Must be only digits")
  //     .min(6, "Pincode Number must be at least 6 number")
  //     .max(6, "Pincode Number not valid on above 6 number")
  //     .required("Enter Pincode"),
  //   gisId: yup
  //     .string()
  //     .matches(/^[0-9]+$/, "Must be only digits")
  //     .required("GIS Id Required"),
});

export default itiTradeMasterSchema;
