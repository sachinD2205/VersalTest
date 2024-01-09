import * as yup from "yup";

// schema - validation for ITI master
let itiMasterSchema = yup.object().shape({
  itiName: yup.string().matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्द ").required("ITI name is Required"),
  // itiType: yup.string().required("ITI type is Required"),
  itiPrefix: yup.string().required("ITI Prefix is Required"),
  itiCode: yup.string().required("ITI code is Required"),

  intake: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .required("Intake is Required"),
  emailId: yup
    .string()
    .email("Incorrect format")
    .required("EmailID id Required"),
  contactPerson: yup.string().matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्द ").required("Contact Person Name is Required"),
  contactNumber: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Mobile Number must be 10 number")
    .max(10, "Mobile Number not valid on above 10 number")
    .required("Enter school contact person Mobile Number"),
  address: yup.string().required("ITI Address is Required"),

  pincode: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(6, "Pincode Number must be at least 6 number")
    .max(6, "Pincode Number not valid on above 6 number")
    .required("Enter Pincode"),
  gisId: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .required("GIS Id Required"),
});

export default itiMasterSchema;
