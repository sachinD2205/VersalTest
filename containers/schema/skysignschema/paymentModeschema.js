import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  paymentModePrefix: yup
    .string()
    .required("Payment Mode  Prefix is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  toDate: yup.string().nullable().required("todate is Required !!!"),
  paymentMode: yup.string().required("Payment Mode  is Required !!!"),
  paymentType: yup.string().required("Payment Type  is Required !!!"),
  //remark:yup.string().required("remark is Required !!!")
});

export default Schema;
