import * as yup from "yup";

let schema = yup.object().shape({
  name: yup
    .string()
    .required("Role Name is Required !!!")
    .matches(
      /^[a-zA-Z\s\-_]+$/,
      "Must be only english characters / फक्त इंग्लिश शब्द "
    ),

  nameMr: yup
    .string()
    .required("Role Name in Marathi is Required !!!")
    .matches(
      /^[\u0900-\u097F\s-]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द"
    ),

  // rolePrefix: yup.string().required(" Role Prefix is Required"),
});

export default schema;
