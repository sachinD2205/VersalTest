import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  financialYearPrefix: yup
    .string()
    .required("Financial Year Prefix is Required !!!"),

  // remark:yup.string().required("remark is Required !!!"),
  financialYear: yup
    .string()
    .matches(/^[0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/, "Invalid input")
    .required("Financial Year is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  toDate: yup.string().nullable().required("To Date is Required !!!"),
});

export default schema;
