import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  castCategoryPrefix: yup
    .string()
    .required("Cast Category Prefix is Required !!!")
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed for this field"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  toDate: yup.string().nullable().required("To Date is Required !!!"),
  castCategory: yup
    .string()
    .required("Cast Category is Required !!!")
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed for this field"),
  castCategoryMr: yup
    .string()
    .required("Cast Category(Mr) is Required !!!")
    .matches(/^[\u0900-\u097F ]+/, "Must be only in marathi/ फक्त मराठी मध्ये"),
});

export default schema;
