import * as yup from "yup";

let schema = yup.object().shape({
    selectedcfcName: yup
      .string()
      .required("Please select a center name")
      .typeError("Please select a center name"),
    departmentKey: yup
      .number()
      .required("Please select a department")
      .typeError("Please select a department"),
  });

  export default schema;