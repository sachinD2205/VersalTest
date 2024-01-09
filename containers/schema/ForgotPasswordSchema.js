import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is Required"),
});

export default schema;
