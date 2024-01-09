import * as yup from "yup";

const schema = yup
  .object({
    oldPassword: yup.string().required("Old Password is required"),
    newPassword: yup
      .string()
      .required("Password is required")
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/,
        "At least one uppercase, one lowercase, one special character, one number, and be at least 8 characters long"
      ),
    // .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
    confirmPassword: yup
      .string()
      .required("Confirm Password is required")
      .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
  })
  .required();

export default schema;
