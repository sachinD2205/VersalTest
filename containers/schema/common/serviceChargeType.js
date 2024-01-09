import * as yup from "yup";

let schema = yup.object().shape({
  // department: yup
  // .string()
  // .required("Department Name is Required !!!"),
  // service: yup.string().required("Service Name is Required !!!"),
  // usageType: yup.string().required("usageType is Required !!!"),
  // document: yup.string().required("document is Required !!!"),
});

export default schema;
