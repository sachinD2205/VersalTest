import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  capacity: yup
    .number()
    .typeError("you must specify a number")
    .required("capacity is Required !!!"),
});

export default schema;
