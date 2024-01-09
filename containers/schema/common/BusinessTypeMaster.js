import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  businessType: yup
    .string()
    .required("Business Type Name is Required !!!")
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed for this field"),
  businessTypeMr: yup
    .string()
    .required("Business Type Name(Mr) is Required !!!")
    .matches(/^[\u0900-\u097F ]+/, "Must be only in marathi/ फक्त मराठी मध्ये"),
  businessTypePrefix: yup
    .string()
    .required(" Description is Required !!")
    .matches(/^[aA-zZ\0-9\s]+$/, "Only alphabets are allowed for this field"),
});

export default schema;
