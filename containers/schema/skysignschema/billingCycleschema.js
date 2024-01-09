import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  billingCyclePrefix: yup
    .string()
    .required("Payment Type  Prefix is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  toDate: yup.string().nullable().required("todate is Required !!!"),
  billingCycle: yup.string().required("Payment Type  is Required !!!"),
  //remark:yup.string().required("remark is Required !!!")
});

export default Schema;
