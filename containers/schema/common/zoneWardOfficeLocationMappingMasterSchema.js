import * as yup from "yup";

let schema = yup.object().shape({
  departmentId: yup
    .string()
    .required("Please select a department name")
    .typeError("Please select a department name"),
  // moduleId: yup
  //   .string()
  //   .required("Please select a application name")
  //   .typeError("Please select a application name"),
  officeLocation: yup
    .string()
    .required("Please select office location")
    .typeError("Please select office location"),
  zone: yup
    .string()
    .required("Please select a zone")
    .typeError("Please select a zone"),
  // ward: yup
  //   .string()
  //   .required("Please select a ward")
  //   .typeError("Please select a ward"),
  ward: yup.array().min(1, "Please select at least one ward"),
});

export default schema;
