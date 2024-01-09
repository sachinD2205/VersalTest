import * as yup from "yup";

let schema = yup.object().shape({
  // department: yup.string().required("Please select a application name."),
  // application: yup.string().required().typeError("Please select a application name"),
  // officeLocation: yup.string().required().typeError("Please enter a office location number"),
  area: yup.array().min(1, "Please select at least one area"),
  zoneNumber: yup.string().required().typeError("Please select a zone number"),
  wardNumber: yup.string().required().typeError("Please enter a ward number"),
});

export default schema;
