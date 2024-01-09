import * as yup from "yup";

// schema - validation
let HawkerMaster = yup.object().shape({
  // hawkerTypePrefix: yup.string().required("Hawker Type Prefix is Required !!!"),
  // fromDate: yup.string().nullable().required("From Date is Required !!!"),
  // hawkerType: yup.string().required("Hawker Type is Required !!!"),
});

export default HawkerMaster;
