import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  roadZonePremiumPrefix: yup
    .string()
    .required("Road Zone Premium   Prefix is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  toDate: yup.string().nullable().required("todate is Required !!!"),
  roadZonePremium: yup.string().required("Road Zone Premium  is Required !!!"),
  roadZonePremiumFactor: yup.string().required("Road Zone Premium Factor  is Required !!!"),
  //remark:yup.string().required("remark is Required !!!")
});

export default Schema;
