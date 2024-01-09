import * as yup from "yup";

let schema = yup.object().shape({
  department: yup.string().nullable().required("Please select department"),
  zoneNumber: yup.string().nullable().required("Please select a zone number"),
  // wardNumber: yup.string().nullable().required("Please enter a ward number"),
  wardNumber: yup.array().min(1, "Please select at least one ward"),
});

export default schema;
