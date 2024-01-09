import * as yup from "yup";

let schema = yup.object().shape({
//     departmentName: yup
//     .string()
//     .required("Department Name is Required !!!"),
  // serviceName: yup.string().nullable().required("Service Name is Required !!!"),
  // zoneName: yup.string().required(" zone is Required !!!"),
  // wardName: yup.string().required(" ward is Required !!!"),
  note: yup.string().required(" note is Required !!!"),
  noteMr: yup.string().required(" noteMr is Required !!!"),
});

export default schema;