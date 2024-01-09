import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  paymentType: yup
    .string()
    .required("Payment Type is Required !!!")
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed for this field"),
  paymentTypeMr: yup
    .string()
    .required("Payment Type (Mr) is Required !!!")
    .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी मध्ये"),
});

export default schema;
