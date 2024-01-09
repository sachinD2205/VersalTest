import * as yup from "yup";

let schema = yup.object().shape({
  chargeNamePrefix: yup
    .string()
    .required(" Charge Name Prefix is Required !!")
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed for this field"),
  charge: yup
    .string()
    .required("Charge Name is Required !!!")
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed for this field"),
  chargeMr: yup
    .string()
    .required("Charge Name (In Marathi) is Required !!!")
    .matches(/^[\u0900-\u097F ]+/, "Must be only in marathi/ फक्त मराठी मध्ये"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  toDate: yup.string().nullable().required("To Date is Required !!!"),
});

export default schema;
