import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  ownershipType: yup
    .string()
    .required("Ownership Type is Required !!!")
    .matches(/^[aA-zZ\0-9\s]+$/, "Only alphabets are allowed for this field"),
  ownershipTypeMr: yup
    .string()
    .required("Ownership Type (In marathi) is Required !!!")
    .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी मध्ये"),
});

export default schema;
