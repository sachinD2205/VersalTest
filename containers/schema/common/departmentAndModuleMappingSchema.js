import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  // department: yup
  //   .string()
  //   .nullable()
  //   .required("Department Name is Required !!!"),
  department: yup.array().min(1, "Please select at least one department"),
  moduleId: yup.string().nullable().required("Module Name is Required !!!"),
  // moduleId: yup.array().min(1, "Please select at least one module"),
});

export default Schema;
