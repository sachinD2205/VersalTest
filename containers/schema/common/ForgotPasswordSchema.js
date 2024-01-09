import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  email: yup.string().email("Incorrect format"),
});

export default Schema;
