import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
    factorPrefix: yup
    .string()
    .required("Factor Prefix is Required !!!"),
  // fromDate: yup.string().nullable().required("From Date is Required !!!"),
//   toDate: yup.string().nullable().required("To Date is Required !!!"),
  // factorName:yup.string().required("Bill Type is Required"),
  // application:yup.string().required("Application is Required"),
});

export default schema;