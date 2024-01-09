import * as yup from "yup";

let schema = yup.object().shape({
  displayOrder: yup
    .string()
    .required("Display order is Required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .typeError("Invalid Quantity")
    .min(1, "Display order must be at least 1 number")
    .max(3, "Display order is not valid on above 3 number"),
  gender: yup
    .string()
    .required("Gender Name is Required !!!")
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed for this field"),
  genderMr: yup
    .string()
    .required("Gender Name(Mr) is Required !!!")
    .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी मध्ये"),
});

export default schema;
