import * as yup from "yup";

let schema = yup.object().shape({
  role: yup.string().nullable().required("Please select a role name."),
  moduleId: yup.string().nullable().required("Please select a module name"),
  // officeLocation: yup
  //   .string()
  //   .nullable()
  //   .required("Please select a location name"),
  // zoneNumber: yup.string().nullable().required("Please select a zone number"),
  // wardNumber: yup.string().nullable().required("Please enter a ward number"),
  // wardNumber: yup.array().min(1, "Please select at least one ward"),
});

export default schema;
