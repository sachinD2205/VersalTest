import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  // cfcId: yup.string().required("Cfc Id is Required !!!"),
  // fromDate: yup.string().nullable().required("From Date is Required !!!"),
  // toDate: yup.string().nullable().required("To Date is Required !!!"),
  cfcName: yup.string().nullable().required("Cfc name is Required"),
  // cfcNameMr: yup.string().required("Cfc Name Mr is Required"),
  cfcUserRemark: yup.string().required("Cfc User Remark is Required"),
  // clerkRemark: yup.string().required("Clerk Remark is Required"),
  // rechargeAmount: yup
  //   .number()
  //   .typeError("you must specify a number")
  //   .required("Recharge Amount"),
  rechargeAmount: yup
    .string()
    .matches(/^[0-9]*$/, "Must be only digits")
    .required("Recharge Amount Required")
    .typeError("Recharge Amount Required")
    .min(1, "Recharge Amount shouldn't be less than 1 digits")
    .max(5, "Recharge Amount shouldn't be greater than 5 digits"),
  // paymentMode: yup.string().nullable().required("Payment Mode is Required !!!"),
});

export default schema;
