import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  illuminationZonePremiumPrefix: yup
    .string()
    .required("Area Zone Premium   Prefix is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  toDate: yup.string().nullable().required("todate is Required !!!"),
  illuminationZonePremium: yup.string().required("Area Zone Premium  is Required !!!"),
  illuminationZonePremiumFactor: yup.string().required("Area Zone Premium Factor  is Required !!!"),
  //remark:yup.string().required("remark is Required !!!")
});

export default Schema;
