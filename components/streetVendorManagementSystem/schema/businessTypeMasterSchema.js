import * as yup from "yup";

// schema - validation
let BusinessTypeMasterSchema = yup.object().shape({
  businessTypePrefix: yup
    .string()
    .required("Business Type Prefix is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  businessType: yup.string().required("Business Type Name is Required !!!"),
});

export default BusinessTypeMasterSchema;
