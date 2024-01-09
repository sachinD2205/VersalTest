import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  businessSubTypePrefix: yup
    .string()
    .required("Business Sub Type Prefix is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  businessType: yup.string().required("Business Type is Required !!!"),
  businessSubType: yup.string().required("Sub Type Business is Required !!!"),
});

export default schema;
