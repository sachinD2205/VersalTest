import * as yup from "yup";

let schema = yup.object().shape({
//     departmentName: yup
//     .string()
//     .required("Department Name is Required !!!"),
//   serviceName: yup.string().nullable().required("Service Name is Required !!!"),
//   documentChecklist: yup.string().required("Document checklist is Required !!!"),
});

export default schema;