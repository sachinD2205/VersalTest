import * as yup from "yup";

let schema = yup.object().shape({
  departmentKey: yup
    .number()
    .required("Please select a department")
    .typeError("Please select a department"),
});

export default schema;
