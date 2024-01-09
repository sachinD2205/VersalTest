import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  title: yup
    .string()
    .required("Title is Required !!!")
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed for this field"),
  // titleMr: yup.string().required("Title Mr is Required !!!"),
  titleMr: yup
    .string()
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द"
    )
    .required("Title Mr is Required !!"),
});

export default schema;

// yup
//   .date("Expiration Date")
//   .nullable()
//   .min(
//     yup.ref("enteredDate"),
//     ({ min }) => `Expiration Date needs to be after Entered Date`,
//   );
