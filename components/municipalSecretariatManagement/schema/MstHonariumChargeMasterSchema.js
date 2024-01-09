import * as yup from "yup";

// Schema - validation
let Schema = yup.object().shape({
  fromDate:yup.string().required("From Date is Required !!!"),
  toDate:yup.string().required("To Date is Required !!!"),
  honorarium:yup.number().required("Honarium name is Required !!!"),
  chargeType:yup.number().required("Charge Type is Required !!!"),
  dependsOn:yup.number().required("Depend On is Required !!!"),
  amount:yup.number().required("Amount is Required !!!"),
  formula:yup.string().required("Formula is Required !!!"),
  
});

export default Schema;

