import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  paymentMode: yup
    .string()
    .required("Payment Type is Required !!!")
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed for this field"),
  paymentModeMr: yup
    .string()
    .required("Payment Type (Mr) is Required !!!")
    .matches(/^[\u0900-\u097F ]+/, "Must be only in marathi/ फक्त मराठी मध्ये"),
  paymentType: yup
    .string()
    .required("Please Choose Payment Type")
    .typeError("Please Choose Payment Type"),
});

export default schema;
