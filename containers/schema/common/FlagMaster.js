import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
    // billPrefix: yup
    // .string()
    // .required("Bill Prefix is Required !!!"),
  // fromDate: yup.string().nullable().required("From Date is Required !!!"),
  // toDate: yup.string().nullable().required("To Date is Required !!!"),
  flagName:yup.string().required("Flag name is Required"),
  setFor:yup.string().required("Set Type is Required"),
});

export default schema;
