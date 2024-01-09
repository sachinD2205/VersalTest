import * as yup from "yup";

// schema - validation
let TaxTypeSchema = yup.object().shape({
  taxTypePrefix: yup.string().required("Tax Type Prefix is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  taxType: yup.string().required("Tax Type is Required !!!"),
});

export default TaxTypeSchema;
