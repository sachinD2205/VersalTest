import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  application: yup.string().required("Module name is Required !!!"),
  service: yup.string().required("Service name is Required !!!"),
  documentChecklistEn: yup
    .string()
    .required("Document checklist is Required !!!")
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed for this field"),
  documentChecklistMr: yup
    .string()
    .required("Document checklist (In marathi) is Required !!!")
    .matches(
      // /^[\u0900-\u097F\s]*$/,
      /^[०-९\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\u0900-\u097F]*$/,
      "Must be only in marathi/ फक्त मराठी मध्ये"
    ),
  typeOfDocument: yup.string().required("Type of master is Required !!!"),
});

export default schema;
