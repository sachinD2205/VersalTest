import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  newPassword: yup.string().required("Password is required"),
  confirmPassword: yup.string().oneOf([yup.ref("newPassword"), null], "must be same as new password"),
});
export default Schema;
