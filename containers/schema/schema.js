import * as yup from "yup";

let schema = yup
  .object({
    Username: yup.string().nullable().required("User Name is Required !!!"),
    password: yup.string().nullable().required("Password is Required !!!"),
  })
  .required();

export default schema;
