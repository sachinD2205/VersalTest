import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  licenseValidityPrefix: yup
    .string()
    .required("License Validity  Prefix is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  toDate: yup.string().nullable().required("todate is Required !!!"),
  licenseValidity: yup.string().required("License Validity  is Required !!!"),
  //remark:yup.string().required("remark is Required !!!")
});

export default Schema;
