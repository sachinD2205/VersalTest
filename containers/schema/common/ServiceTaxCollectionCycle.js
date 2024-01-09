import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  serviceTaxCollectionCyclePrefix: yup
    .string()
    .required("Service Tax Collection Cycle Prefix is Required !!!"),
  // fromDate: yup.string().nullable().required("From Date is Required !!!"),
  serviceTaxCollectionCycle: yup
    .string()
    .required("Service Tax Collection Cycle is Required !!!"),
});


export default schema;
