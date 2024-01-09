import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  zonePremiumPrefix: yup
    .string()
    .required("zone Premium Prefix is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  toDate: yup.string().nullable().required("todate is Required !!!"),
  zonePremium: yup.string().required("zone Premium is Required !!!"),
  //remark:yup.string().required("remark is Required !!!")
});

export default Schema;
