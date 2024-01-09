import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  businessCategoryPrefix: yup
    .string()
    .required("Business Category Prefix is Required !!!")
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed for this field"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  toDate: yup.string().nullable().required("To Date is Required !!!"),
  businessName: yup
    .string()
    .required("Business Name is Required !!!")
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed for this field"),
  // subBusinessType: yup.string().nullable().required("Sub Business Type is Required !!!"),
});

export default schema;
