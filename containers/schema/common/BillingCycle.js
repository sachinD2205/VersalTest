import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  billingCycle: yup.string().required("Billing Cycle   is Required !!!"),
  billingCycleMr: yup.string().required("Billing Cycle Mr  is Required !!!"),
});

export default schema;
