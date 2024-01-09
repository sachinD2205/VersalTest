import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  religion: yup
    .string()
    .required("Religion Name is Required !!!")
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed for this field"),
  religionMr: yup
    .string()
    .required("Religion Name (In Marathi) is Required !!!")
    .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी मध्ये"),
});

export default schema;
