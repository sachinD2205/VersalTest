import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  penaltyMasterPrefix: yup
    .string()
    .required("Penalty Master  Prefix is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  toDate: yup.string().nullable().required("todate is Required !!!"),
  penaltyMaster: yup.string().required("Penalty Master  is Required !!!"),
  //remark:yup.string().required("remark is Required !!!")
});

export default Schema;
