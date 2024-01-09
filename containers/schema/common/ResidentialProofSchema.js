import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  department: yup.string().required("Department  is Required !!!"),
  service :yup.string().required("Service Name  is Required !!!"),
  typeOFDocument :yup.string().required("Type OF Document  is Required !!!"),
  documentChecklist :yup.string().required("Document Checklist is Required !!!"),
});

export default Schema;