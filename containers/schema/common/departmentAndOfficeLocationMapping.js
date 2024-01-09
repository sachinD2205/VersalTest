import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  department: yup
    .string()
    .nullable()
    .required("Department Name is Required !!!"),
  // officeLocation:yup.string().nullable().required("Office Location is Required !!!"),
  officeLocation: yup
    .array()
    .min(1, "Please select at least one office location"),
});

export default Schema;
