import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  // businessSubTypePrefix: yup.string().required("Business Sub Type Prefix is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  toDate: yup.string().nullable().required("To Date is Required !!!"),
  businessType: yup
    .string()
    .nullable()
    .required("Business Type is Required !!!"),
  // businessSubType: yup.string().required("Sub Type Business is Required !!!"),

  businessSubTypePrefix: yup
    .string()
    .required("Sub Type Business is Required !!!")
    .matches(/^[aA-zZ\0-9\s]+$/, "Only alphabets are allowed for this field"),
  businessSubType: yup
    .string()
    .required("Sub Type Business is Required !!!")
    .matches(/^[aA-zZ\0-9\s]+$/, "Only alphabets are allowed for this field"),
  businessSubTypeMr: yup
    .string()
    .required("Sub Type Business is Required !!!")
    .matches(/^[\u0900-\u097F ]+/, "Must be only in marathi/ फक्त मराठी मध्ये"),
});

export default schema;
