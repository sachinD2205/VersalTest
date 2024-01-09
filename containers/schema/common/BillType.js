import * as yup from "yup";

let schema = yup.object().shape({
  billType: yup
    .string()
    .required("Bill Type is Required !!!")
    .matches(/^[aA-zZ\0-9\s]+$/, "Only alphabets are allowed for this field"),
  billTypeMr: yup
    .string()
    .required("Bill Type (In marathi) is Required !!!")
    .matches(/^[\u0900-\u097F ]+/, "Must be only in marathi/ फक्त मराठी मध्ये"),
});

export default schema;
