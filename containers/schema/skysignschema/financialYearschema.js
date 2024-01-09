import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  financialYearPrefix: yup
    .string()
    .required("Financial Year Prefix is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  toDate: yup.string().nullable().required("todate is Required !!!"),
  // remark:yup.string().required("remark is Required !!!"),
  financialYear: yup.string().required("Financial Year  is Required !!!"),
});

export default Schema;
