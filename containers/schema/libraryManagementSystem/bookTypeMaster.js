import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  bookTypeCode: yup
    .string()
    .required("Book Type Code is Required !!!")
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed for this field"),
  bookType: yup
    .string()
    .required("Book Type is Required !!!")
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed for this field"),
});

export default schema;
