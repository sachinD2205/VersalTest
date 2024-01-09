import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  bookConditionEng: yup
    .string()
    .required("Book Condition Is Required !!!")
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed for this field"),
  bookConditionMar: yup
    .string()
    .required("Book Condition In Marathi Is Required !!!")
    .matches(
      /^[a-zA-Z\s\u0900-\u0965\u096F-\u097F]+$/,
      "Only alphabets and spaces are allowed for this field"
    ),
});

export default schema;
