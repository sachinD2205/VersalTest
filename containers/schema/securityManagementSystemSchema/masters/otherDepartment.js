import * as yup from "yup";
import FormattedLabel from "../../../reuseableComponents/FormattedLabel";

// schema - validation
let Schema = yup.object().shape({
  otherDepartment: yup
    .string()
    .matches(/^[a-zA-Z0-9\s]*$/, "Other Department only contain letters, numbers")
    .required("Other department is required"),
  otherDepartmentMr: yup
    .string()
    .required("Other department in marathi is required")
    .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters"),
});

export default Schema;
