import * as yup from "yup";

let schema = yup.object().shape({
  department: yup
    .string()
    .nullable()
    .required("Department Name is Required !!!"),
  service: yup.string().nullable().required("Service Name is Required !!!"),
  usageType: yup.string().nullable().required("Usage Type is Required !!!"),
  document: yup.string().nullable().required("Document Name is Required !!!"),
});

export default schema;
