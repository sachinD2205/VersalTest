import * as yup from "yup";

// schema - validation
let sachinTempSchema = yup.object().shape({
  //   penaltyPrefix: yup.string().required("Penalty Prefix is Required !!!"),
  //   fromDate: yup.string().nullable().required("From Date is Required !!!"),
  //   penaltyType: yup.string().required("Penalty Type is Required !!!"),
});

export default sachinTempSchema;
