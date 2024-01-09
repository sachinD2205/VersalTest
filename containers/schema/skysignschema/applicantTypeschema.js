import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  applicantTypePrefix: yup
    .string()
    .required("Applicant Type Prefix is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  toDate: yup.string().nullable().required("todate is Required !!!"),
  // remark:yup.string().required("remark is Required !!!"),
  applicantType: yup.string().required("Applicant Type  is Required !!!"),
});

export default Schema;
