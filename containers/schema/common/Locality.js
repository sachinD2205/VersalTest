import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  toDate: yup.string().nullable().required("To Date is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),

  landMark: yup
    .string()
    .required("Landmark is Required !!!")
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed for this field"),
  landMarkMr: yup
    .string()
    .required("Landmark Mr is Required !!!")
    .matches(
      /^[\u0900-\u097F\s]*$/,
      "Must be only in marathi/ फक्त मराठी मध्ये"
    ),
  localityPrefix: yup
    .string()
    .required("Locality Prefix is Required !!!")
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed for this field"),
  zone: yup.string().required("Zone is Required !!!"),
});
//
export default schema;
