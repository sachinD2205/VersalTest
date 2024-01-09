import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  // rateChartOfIndustrialLicensePrefix: yup
  //   .string()
  //   .required("Rate Chart of Industrial License Prefix is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  toDate: yup.string().nullable().required("To date is Required !!!"),
  // noOfEmployees: yup.string().required("No of Employees  is Required !!!"),
  rate: yup.string().required("Rate is Required !!!"),
  //remark:yup.string().required("remark is Required !!!")
});

export default Schema;
